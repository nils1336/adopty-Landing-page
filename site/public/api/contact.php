<?php
// ── CORS & Headers ────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: https://adopty.de');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

// ── Input validation ──────────────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige E-Mail-Adresse']);
    exit;
}

// ── Rate limiting (simple: 1 request per IP per 60s via tmp file) ─────────────
$ip_hash  = md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$tmp_file = sys_get_temp_dir() . '/adopty_rl_' . $ip_hash;
if (file_exists($tmp_file) && (time() - filemtime($tmp_file)) < 60) {
    http_response_code(429);
    echo json_encode(['error' => 'Bitte warte einen Moment']);
    exit;
}
touch($tmp_file);

// ── Send email ────────────────────────────────────────────────────────────────
$to      = 'nils@new-thought.com';
$subject = '=?UTF-8?B?' . base64_encode('⚡ Adopty — Neuer Zugangsantrag') . '?=';
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Adopty <no-reply@adopty.de>',
    'Reply-To: ' . $email,
    'X-Mailer: Adopty-Contact/1.0',
]);

$safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$date       = date('d.m.Y, H:i') . ' Uhr';
$ip         = htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? '', ENT_QUOTES, 'UTF-8');

$body = <<<HTML
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:28px 32px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1a1a1a;border-radius:8px;padding:6px 10px;margin-right:10px">
                  <span style="color:#10b981;font-size:16px">⚡</span>
                </td>
                <td style="padding-left:10px">
                  <span style="color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.02em">Adopty</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#0a0a0a;letter-spacing:-0.02em">Neuer Zugangsantrag</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Jemand möchte frühen Zugang zu Adopty.</p>

            <!-- Email card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f9f9f9;border:1px solid #e8e5de;border-radius:12px;margin-bottom:24px">
              <tr>
                <td style="padding:20px 24px">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em">E-Mail-Adresse</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#0a0a0a">{$safe_email}</p>
                </td>
              </tr>
            </table>

            <!-- Reply button -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#10b981;border-radius:10px">
                  <a href="mailto:{$safe_email}?subject=Dein%20Adopty-Zugang"
                    style="display:inline-block;padding:14px 28px;color:#fff;font-size:15px;font-weight:700;text-decoration:none">
                    Jetzt antworten →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:0 32px 28px">
            <hr style="border:none;border-top:1px solid #f0ede8;margin:0 0 20px">
            <p style="margin:0;font-size:12px;color:#9ca3af">
              Eingegangen am {$date}<br>
              IP: {$ip} · Gesendet von adopty.de
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'E-Mail konnte nicht gesendet werden']);
}
