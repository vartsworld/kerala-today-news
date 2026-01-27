export const CONTACT = {
  phoneDisplay: "+91 85473 63646",
  phoneTel: "+918547363646", // digits only for tel: and WhatsApp
  whatsapp: "+918547363646", // digits only with country code
  email: "keralatodaychannel24x7@gmail.com",
};

export const whatsappLink = (text = "Hello Kerala Today News") => {
  const number = CONTACT.whatsapp.replace(/\D/g, "");
  const msg = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${msg}`;
};
