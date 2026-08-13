const TEMPLATE_NAME = 'findyourdomain';
const INDIA_PREFIX = '91';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_ANSWER_TEXT_LENGTH = 160;
const MAX_SECOND_SOURCE_LENGTH = 80;
const ALLOWED_SOURCES = new Set(['landing', 'career-assessment-landing', 'local-test']);
const SALESMAX_TEMPLATE_NAME = 'salesmax_leads';
const SALESMAX_SOURCE = 'youtube-malayalam';

const ROADMAPS = {
  'Game Development': {
    domain: 'Game Development',
    roadmap_url: 'https://docs.google.com/document/d/1KPUHan8HWMtMj0mnVKBVM_T-hJk5w3PW33LXwCislVE/edit?usp=drive_link'
  },
  'Cyber Security': {
    domain: 'Cyber Security',
    roadmap_url: 'https://docs.google.com/document/d/1RcrdBATUIDgGPxsw2DOya45vXkGwsVawZPOOO6S6Nnc/edit?usp=drive_link'
  },
  'Mobile Development': {
    domain: 'Mobile Application Development',
    roadmap_url: 'https://docs.google.com/document/d/1xXZtt0eGENVVzSesChY3JeIIjmxfR701tl2J0TPsmFI/edit?usp=drive_link'
  },
  'Web Development': {
    domain: 'MERN Stack',
    roadmap_url: 'https://docs.google.com/document/d/1v8z-VcnpTaq1GNbSi0U47vSJEAeUspkFUxApPIVRZkg/edit?usp=drive_link'
  },
  'Artificial Intelligence & ML': {
    domain: 'Machine Learning',
    roadmap_url: 'https://docs.google.com/document/d/1Oyw2xqXoIJ3pq0ttI6-VWO1Sx4d9To7g7lm9PXSBcfo/edit?usp=sharing'
  },
  'Data Science': {
    domain: 'Data Science',
    roadmap_url: 'https://docs.google.com/document/d/135uIm8GCqc57HOZwajGuwTQX_SFD22_PKuFRKTVCzLQ/edit?usp=drivesdk'
  }
};

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

const json = (body, status = 200) => (
  new Response(JSON.stringify(body), { status, headers: responseHeaders })
);

function withCors(response, env, request) {
  const origin = request.headers.get('Origin') || '';

  if (!origin || !isOriginAllowed(env, origin)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

const normalizeEndpoint = (endpoint) => endpoint.replace(/\/+$/, '');

function getWatiV3Base(endpoint) {
  const url = new URL(endpoint);
  url.search = '';
  url.hash = '';
  url.pathname = url.pathname
    .replace(/\/api\/.*$/i, '')
    .replace(/\/\d+\/?$/, '');

  return normalizeEndpoint(url.toString());
}

const maskPhone = (phoneNumber) => phoneNumber.replace(/^(\d{4})\d+(\d{2})$/, '$1******$2');

const isDebugEnabled = (env) => env.REGISTER_DEBUG === '1' || env.REGISTER_DEBUG === 'true';

function debugLog(env, label, details = {}) {
  if (!isDebugEnabled(env)) return;
  console.log(`[register] ${label}`, JSON.stringify(details));
}

function stringifyError(error) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }

  return { message: String(error) };
}

async function parseJson(request) {
  const contentType = request.headers.get('Content-Type') || '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return { error: 'content-type' };
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);

  if (contentLength > MAX_BODY_BYTES) {
    return { error: 'too-large' };
  }

  try {
    const bodyText = await request.text();

    if (bodyText.length > MAX_BODY_BYTES) {
      return { error: 'too-large' };
    }

    return { body: JSON.parse(bodyText) };
  } catch {
    return { error: 'invalid-json' };
  }
}

async function sha256Hex(value) {
  if (!value) return null;
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function validateLead(body) {
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const phoneNumber = typeof body?.whatsapp === 'string' ? body.whatsapp.replace(/\D/g, '') : '';
  const assignedPath = typeof body?.assigned_path === 'string' ? body.assigned_path.trim() : '';
  const category = typeof body?.category === 'string' ? body.category.trim().slice(0, 80) : null;
  const source = typeof body?.source === 'string' ? body.source.trim().slice(0, 80) : 'landing';
  const secondSource = sanitizeSecondSource(body?.second_source);
  const honeypot = typeof body?.website === 'string' ? body.website.trim() : '';
  const roadmap = ROADMAPS[assignedPath];

  if (honeypot) {
    return { error: 'Please submit the form again.' };
  }

  if (!name) {
    return { error: 'Please enter your name.' };
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return { error: 'Please enter a valid 10 digit WhatsApp number.' };
  }

  if (!roadmap) {
    return { error: 'We could not match this result to a roadmap. Please retake the quiz.' };
  }

  if (!ALLOWED_SOURCES.has(source)) {
    return { error: 'Please submit the form again.' };
  }

  return {
    lead: {
      id: crypto.randomUUID(),
      name,
      phone_number: phoneNumber,
      whatsapp_number: `${INDIA_PREFIX}${phoneNumber}`,
      assigned_path: assignedPath,
      domain: roadmap.domain,
      roadmap_url: roadmap.roadmap_url,
      category,
      answers: sanitizeAnswers(body?.answers),
      source,
      second_source: secondSource
    }
  };
}

function sanitizeSecondSource(value) {
  if (typeof value !== 'string') {
    return 'direct';
  }

  const normalized = value
    .trim()
    .slice(0, MAX_SECOND_SOURCE_LENGTH)
    .replace(/[^\w .:/-]/g, '');

  return normalized || 'direct';
}

function sanitizeAnswers(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(answers)
      .slice(0, 12)
      .filter(([key, value]) => /^\d+$/.test(key) && typeof value === 'string')
      .map(([key, value]) => [key, value.trim().slice(0, MAX_ANSWER_TEXT_LENGTH)])
  );
}

function assertEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);

  if (missing.length) {
    throw new Error(`Missing server configuration: ${missing.join(', ')}`);
  }
}

async function insertSupabase(env, table, row) {
  debugLog(env, 'supabase insert:start', { table });

  const url = `${normalizeEndpoint(env.SUPABASE_URL)}/rest/v1/${table}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(row)
  });

  if (!response.ok) {
    const detail = await response.text();
    debugLog(env, 'supabase insert:failed', { table, status: response.status, detail });
    throw new Error(`Supabase insert failed for ${table}: ${detail}`);
  }

  debugLog(env, 'supabase insert:ok', { table, status: response.status });
}

async function insertLead(env, lead) {
  const leadInsertRow = toLeadInsertRow(lead);

  try {
    await insertSupabase(env, 'career_assessment_leads', leadInsertRow);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes('second_source')) {
      throw error;
    }

    const fallbackRow = { ...leadInsertRow };
    delete fallbackRow.second_source;
    console.error('[register] second_source column missing; run the latest Supabase migration', {
      lead_id: lead.id
    });
    await insertSupabase(env, 'career_assessment_leads', fallbackRow);
  }
}

function toLeadInsertRow(lead) {
  const leadInsertRow = { ...lead };
  delete leadInsertRow.roadmap_url;
  delete leadInsertRow.domain;
  return leadInsertRow;
}

function validateOrigin(env, request) {
  if (!env.ALLOWED_ORIGINS) {
    return true;
  }

  const origin = request.headers.get('Origin') || '';

  if (!origin) {
    return true;
  }

  return isOriginAllowed(env, origin);
}

function isOriginAllowed(env, origin) {
  if (!env.ALLOWED_ORIGINS) {
    return true;
  }

  const allowedOrigins = env.ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin.includes('*')) {
      const pattern = `^${allowedOrigin
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\*/g, '[^.]+')}$`;

      return new RegExp(pattern).test(origin);
    }

    return allowedOrigin === origin;
  });
}

function sanitizeProviderResponse(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\b91\d{10}\b/g, '[masked-phone]')
      .replace(/\b\d{10}\b/g, '[masked-phone]');
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeProviderResponse(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (/token|authorization|api[-_]?key|secret/i.test(key)) {
          return [key, '[hidden]'];
        }

        if (/phone|mobile|whatsapp|recipient/i.test(key) && typeof item === 'string') {
          return [key, maskPhone(item)];
        }

        return [key, sanitizeProviderResponse(item)];
      })
    );
  }

  return value;
}

async function sendWatiTemplate(env, lead) {
  if (env.TEST_MODE === '1' || env.TEST_MODE === 'true') {
    return {
      ok: true,
      status: 200,
      requestLog: {
        template_name: TEMPLATE_NAME,
        broadcast_name: `${TEMPLATE_NAME}_${lead.id}`,
        channel: env.WATI_CHANNEL || null,
        recipient: maskPhone(lead.whatsapp_number),
        custom_params: ['name', 'domain', 'link'],
        test_mode: true
      },
      responseBody: { test_mode: true }
    };
  }

  const broadcastName = `${TEMPLATE_NAME}_${lead.id}`;
  const customParams = [
    { name: 'name', value: lead.name },
    { name: 'domain', value: lead.domain },
    { name: 'link', value: lead.roadmap_url }
  ];
  const requestBody = {
    channel: env.WATI_CHANNEL || null,
    template_name: TEMPLATE_NAME,
    broadcast_name: broadcastName,
    recipients: [
      {
        phone_number: lead.whatsapp_number,
        custom_params: customParams
      }
    ]
  };
  const watiBase = getWatiV3Base(env.WATI_API_ENDPOINT);
  const watiUrl = `${watiBase}/api/ext/v3/messageTemplates/send`;
  const requestLog = {
    template_name: TEMPLATE_NAME,
    broadcast_name: broadcastName,
    channel: env.WATI_CHANNEL || null,
    recipient: maskPhone(lead.whatsapp_number),
    custom_params: customParams.map((param) => param.name)
  };

  debugLog(env, 'wati send:start', {
    ...requestLog,
    endpoint: watiUrl,
    configured_endpoint: normalizeEndpoint(env.WATI_API_ENDPOINT),
    custom_params_preview: customParams.map((param) => ({
      name: param.name,
      value: param.name === 'link' ? '[roadmap link configured]' : param.value
    }))
  });

  const response = await fetch(watiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.WATI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const responseText = await response.text();
  let responseBody;

  try {
    responseBody = responseText ? JSON.parse(responseText) : {};
  } catch {
    responseBody = { raw: responseText };
  }

  debugLog(env, 'wati send:response', {
    ok: response.ok,
    status: response.status,
    responseBody
  });

  return {
    ok: response.ok,
    status: response.status,
    requestLog,
    responseBody
  };
}

async function sendSalesmaxLead(env, lead) {
  const requestBody = {
    update: true,
    data: [
      {
        name: lead.name,
        country_code: INDIA_PREFIX,
        phone: lead.phone_number,
        current_status: lead.category || 'unknown',
        source: SALESMAX_SOURCE,
        '2nd_Source': lead.second_source
      }
    ]
  };
  const requestLog = {
    source: SALESMAX_SOURCE,
    second_source: lead.second_source,
    current_status: lead.category || 'unknown',
    country_code: INDIA_PREFIX,
    phone: maskPhone(`${INDIA_PREFIX}${lead.phone_number}`)
  };

  if (env.TEST_MODE === '1' || env.TEST_MODE === 'true') {
    return {
      ok: true,
      status: 200,
      requestLog: { ...requestLog, test_mode: true },
      responseBody: { test_mode: true }
    };
  }

  if (!env.SALESMAX_LEADS_URL) {
    throw new Error('Missing server configuration: SALESMAX_LEADS_URL');
  }

  debugLog(env, 'salesmax send:start', requestLog);

  const response = await fetch(env.SALESMAX_LEADS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  const responseText = await response.text();
  let responseBody;

  try {
    responseBody = responseText ? JSON.parse(responseText) : {};
  } catch {
    responseBody = { raw: responseText };
  }

  debugLog(env, 'salesmax send:response', {
    ok: response.ok,
    status: response.status,
    responseBody: sanitizeProviderResponse(responseBody)
  });

  return {
    ok: response.ok,
    status: response.status,
    requestLog,
    responseBody
  };
}

async function recordDeliveryEvent(env, leadId, watiResult) {
  await insertSupabase(env, 'career_assessment_delivery_events', {
    lead_id: leadId,
    provider: 'wati',
    template_name: TEMPLATE_NAME,
    status: watiResult.ok ? 'sent' : 'failed',
    request: watiResult.requestLog,
    response: sanitizeProviderResponse(watiResult.responseBody),
    error: watiResult.ok ? null : `WATI returned HTTP ${watiResult.status}`
  });
}

async function recordCrmEvent(env, leadId, crmResult) {
  await insertSupabase(env, 'career_assessment_delivery_events', {
    lead_id: leadId,
    provider: 'salesmax_crm',
    template_name: SALESMAX_TEMPLATE_NAME,
    status: crmResult.ok ? 'sent' : 'failed',
    request: crmResult.requestLog,
    response: sanitizeProviderResponse(crmResult.responseBody),
    error: crmResult.ok ? null : `Salesmax returned HTTP ${crmResult.status}`
  });
}

async function syncSalesmax(env, lead) {
  try {
    const crmResult = await sendSalesmaxLead(env, lead);
    await recordCrmEvent(env, lead.id, crmResult);

    if (!crmResult.ok) {
      console.error('[register] salesmax failed', {
        lead_id: lead.id,
        status: crmResult.status,
        response: sanitizeProviderResponse(crmResult.responseBody)
      });
    }
  } catch (error) {
    console.error('[register] salesmax failed', stringifyError(error));

    try {
      await recordCrmEvent(env, lead.id, {
        ok: false,
        status: 0,
        requestLog: {
          source: SALESMAX_SOURCE,
          second_source: lead.second_source,
          current_status: lead.category || 'unknown',
          country_code: INDIA_PREFIX,
          phone: maskPhone(`${INDIA_PREFIX}${lead.phone_number}`)
        },
        responseBody: {},
      });
    } catch (eventError) {
      console.error('[register] salesmax event failed', stringifyError(eventError));
    }
  }
}

function optionsResponse(env, request) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  const origin = request.headers.get('Origin') || '';

  if (origin && isOriginAllowed(env, origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  return new Response(null, {
    status: 204,
    headers
  });
}

async function handlePost(context) {
  const { request, env } = context;
  const requestId = crypto.randomUUID();
  const parsed = await parseJson(request);

  if (parsed.error === 'content-type') {
    return json({ success: false, message: 'Please submit the form again.' }, 415);
  }

  if (parsed.error === 'too-large') {
    return json({ success: false, message: 'Please submit the form again.' }, 413);
  }

  if (parsed.error) {
    return json({ success: false, message: 'Please submit the form again.' }, 400);
  }

  if (!validateOrigin(env, request)) {
    return json({ success: false, message: 'Please submit the form again.' }, 403);
  }

  const body = parsed.body;

  debugLog(env, 'request:start', {
    requestId,
    method: request.method,
    assigned_path: body?.assigned_path,
    phone: typeof body?.whatsapp === 'string' ? maskPhone(`${INDIA_PREFIX}${body.whatsapp.replace(/\D/g, '')}`) : null
  });

  let lead;

  try {
    const validation = validateLead(body);

    if (validation.error) {
      debugLog(env, 'request:validation_failed', { requestId, message: validation.error });
      return json({ success: false, message: validation.error }, 400);
    }

    assertEnv(env, [
      'SUPABASE_URL',
      'SUPABASE_PUBLISHABLE_KEY',
      'WATI_API_ENDPOINT',
      'WATI_API_KEY'
    ]);

    lead = validation.lead;
    debugLog(env, 'request:validated', {
      requestId,
      leadId: lead.id,
      assigned_path: lead.assigned_path,
      domain: lead.domain,
      phone: maskPhone(lead.whatsapp_number)
    });
    lead.user_agent = request.headers.get('User-Agent') || null;
    lead.ip_hash = await sha256Hex(request.headers.get('CF-Connecting-IP') || '');

    await insertLead(env, lead);
  } catch (error) {
    console.error('[register] save failed', stringifyError(error));
    return json({
      success: false,
      message: 'We could not save your roadmap request right now. Please try again.'
    }, 502);
  }

  await syncSalesmax(env, lead);

  try {
    const watiResult = await sendWatiTemplate(env, lead);
    await recordDeliveryEvent(env, lead.id, watiResult);

    if (!watiResult.ok) {
      const isRateLimited = watiResult.status === 429;
      return json({
        success: false,
        message: isRateLimited
          ? 'WhatsApp is busy right now. Please try again in a few minutes.'
          : 'We saved your request, but could not send the WhatsApp message right now. Please try again.'
      }, isRateLimited ? 429 : 502);
    }

    debugLog(env, 'request:success', { requestId, leadId: lead.id });

    return json({
      success: true,
      lead_id: lead.id,
      message: 'Roadmap request received. We will send it on WhatsApp.'
    });
  } catch (error) {
    console.error('[register] delivery failed', stringifyError(error));
    return json({
      success: false,
      message: 'We saved your request, but could not finish the WhatsApp delivery log. Please try again.'
    }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return optionsResponse(context.env, context.request);
  }

  if (context.request.method === 'POST') {
    return withCors(await handlePost(context), context.env, context.request);
  }

  return withCors(json({ success: false, message: 'Method not allowed.' }, 405), context.env, context.request);
}
