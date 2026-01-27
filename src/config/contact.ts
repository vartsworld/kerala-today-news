export const CONTACT = {
  phoneDisplay: "+91 9747771777",
  phoneTel: "+919747771777", // digits only for tel: and WhatsApp
  whatsapp: "+919747771777", // digits only with country code
  email: "news@achayansmedia.com",
};

export const whatsappLink = (text = "Hello Achayans Media") => {
  const number = CONTACT.whatsapp.replace(/\D/g, "");
  const msg = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${msg}`;
};
