// Arma el enlace mailto en el navegador para que el correo no figure en el HTML.
for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-email-user]')) {
  const { emailUser, emailDomain } = link.dataset;
  if (emailUser && emailDomain) link.href = `mailto:${emailUser}@${emailDomain}`;
}
