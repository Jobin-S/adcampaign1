const TEMPLATE_NAME = 'findyourdomain';
const INDIA_PREFIX = '91';

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
    roadmap_url: 'https://docs.google.com/document/d/1lV69X8S_s6OZlbfyJ3dQhWh0nMkMA0Dimxl30YvREww/edit?usp=drive_link'
  },
  'Data Science': {
    domain: 'Data Science',
    roadmap_url: 'https://docs.google.com/document/d/1MpLD1zo3KG-64DfAuqrh27dEaTqOM8syEKtuEpV__do/edit?usp=drive_link'
  }
};

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

const json = (body, status = 200) => (
  new Response(JSON.stringify(body), { status, headers: responseHeaders })
);

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
  try {
    return await request.json();
  } catch {
    return null;
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
  const roadmap = ROADMAPS[assignedPath];

  if (!name) {
    return { error: 'Please enter your name.' };
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return { error: 'Please enter a valid 10 digit WhatsApp number.' };
  }

  if (!roadmap) {
    return { error: 'We could not match this result to a roadmap. Please retake the quiz.' };
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
      answers: body?.answers && typeof body.answers === 'object' ? body.answers : {},
      source: typeof body?.source === 'string' ? body.source.trim().slice(0, 80) : 'landing'
    }
  };
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

function toLeadInsertRow(lead) {
  const leadInsertRow = { ...lead };
  delete leadInsertRow.roadmap_url;
  delete leadInsertRow.domain;
  return leadInsertRow;
}

async function sendWatiTemplate(env, lead) {
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
    endpoint: watiUrl,
    configured_endpoint: normalizeEndpoint(env.WATI_API_ENDPOINT),
    template_name: TEMPLATE_NAME,
    broadcast_name: broadcastName,
    channel: env.WATI_CHANNEL || null,
    recipient: maskPhone(lead.whatsapp_number),
    custom_params: customParams.map((param) => ({
      name: param.name,
      value: param.name === 'link' ? '[roadmap link configured]' : param.value
    }))
  };

  debugLog(env, 'wati send:start', requestLog);

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

async function recordDeliveryEvent(env, leadId, watiResult) {
  await insertSupabase(env, 'career_assessment_delivery_events', {
    lead_id: leadId,
    provider: 'wati',
    template_name: TEMPLATE_NAME,
    status: watiResult.ok ? 'sent' : 'failed',
    request: watiResult.requestLog,
    response: watiResult.responseBody,
    error: watiResult.ok ? null : `WATI returned HTTP ${watiResult.status}`
  });
}

function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    }
  });
}

async function handlePost(context) {
  const { request, env } = context;
  const requestId = crypto.randomUUID();
  const body = await parseJson(request);

  debugLog(env, 'request:start', {
    requestId,
    method: request.method,
    assigned_path: body?.assigned_path,
    phone: typeof body?.whatsapp === 'string' ? maskPhone(`${INDIA_PREFIX}${body.whatsapp.replace(/\D/g, '')}`) : null
  });

  if (!body) {
    return json({ success: false, message: 'Please submit the form again.' }, 400);
  }

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

    await insertSupabase(env, 'career_assessment_leads', toLeadInsertRow(lead));
  } catch (error) {
    console.error('[register] save failed', stringifyError(error));
    return json({
      success: false,
      message: 'We could not save your roadmap request right now. Please try again.'
    }, 502);
  }

  try {
    const watiResult = await sendWatiTemplate(env, lead);
    await recordDeliveryEvent(env, lead.id, watiResult);

    if (!watiResult.ok) {
      const isRateLimited = watiResult.status === 429;
      const debugMessage = isDebugEnabled(env)
        ? ` WATI status: ${watiResult.status}. Response: ${JSON.stringify(watiResult.responseBody).slice(0, 300)}`
        : '';
      return json({
        success: false,
        message: isRateLimited
          ? `WhatsApp is busy right now. Please try again in a few minutes.${debugMessage}`
          : `We saved your request, but could not send the WhatsApp message right now. Please try again.${debugMessage}`
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
    return optionsResponse();
  }

  if (context.request.method === 'POST') {
    return handlePost(context);
  }

  return json({ success: false, message: 'Method not allowed.' }, 405);
}
