// frontend/src/data.js
// KIVILCIM v2 İDEAL VERİ DOSYASI (Şiir Görselleri Eklendi)

// --- GÖRSEL IMPORTLARI ---
import blueyImg from './assets/karakterler/bluey.png';
import bingoImg from './assets/karakterler/bingo.png';
import baykusKizImg from './assets/karakterler/baykus_kiz.png';
import pirilImg from './assets/karakterler/piril.png';
import elifImg from './assets/karakterler/elif.png';
import elsaImg from './assets/karakterler/elsa.png';
import sirinImg from './assets/karakterler/sirin.png';
import heidiImg from './assets/karakterler/heidi.png';
import niloyaImg from './assets/karakterler/niloya.png';
import moanaImg from './assets/karakterler/moana.png';
import kediCocukImg from './assets/karakterler/kedi_cocuk.png';
import kertenkeleImg from './assets/karakterler/kertenkele.png';
import kamilImg from './assets/karakterler/kamil.png';
import hayriImg from './assets/karakterler/hayri.png';
import gargamelImg from './assets/karakterler/gargamel.png';
import stitchImg from './assets/karakterler/stitch.png';
import kukuliImg from './assets/karakterler/kukuli.png';
import nasreddinHocaImg from './assets/karakterler/nasreddin_hoca.png';
import hulkImg from './assets/karakterler/hulk.png';
import orumcekAdamImg from './assets/karakterler/orumcek_adam.png';
import sonicImg from './assets/karakterler/sonic.png';

import snoopyImg from './assets/ornekler/snoopy.jpg';
import aliMirmirImg from './assets/ornekler/ali_ve_mirmir.jpg';
import deneyImg from './assets/ornekler/deney.jpg';
import telefonImg from './assets/ornekler/telefon.jpg';

export const KARAKTERLER = [
  { id: 'bluey', name: 'Bluey', img: blueyImg },
  { id: 'bingo', name: 'Bingo', img: bingoImg },
  { id: 'baykus_kiz', name: 'Baykuş Kız', img: baykusKizImg },
  { id: 'piril', name: 'Pırıl', img: pirilImg },
  { id: 'elif', name: 'Elif', img: elifImg },
  { id: 'elsa', name: 'Elsa', img: elsaImg },
  { id: 'sirin', name: 'Şirine', img: sirinImg },
  { id: 'heidi', name: 'Heidi', img: heidiImg },
  { id: 'niloya', name: 'Niloya', img: niloyaImg },
  { id: 'moana', name: 'Moana', img: moanaImg },
  { id: 'kedi_cocuk', name: 'Kedi Çocuk', img: kediCocukImg },
  { id: 'kertenkele', name: 'Kertenkele', img: kertenkeleImg },
  { id: 'kamil', name: 'Kamil', img: kamilImg },
  { id: 'hayri', name: 'Hayri', img: hayriImg },
  { id: 'gargamel', name: 'Gargamel', img: gargamelImg },
  { id: 'stitch', name: 'Stitch', img: stitchImg },
  { id: 'kukuli', name: 'Kukuli', img: kukuliImg },
  { id: 'nasreddin_hoca', name: 'Nasreddin Hoca', img: nasreddinHocaImg },
  { id: 'hulk', name: 'Hulk', img: hulkImg },
  { id: 'orumcek_adam', name: 'Örümcek Adam', img: orumcekAdamImg },
  { id: 'sonic', name: 'Sonic', img: sonicImg }
];

export const TEMALAR = [
  { id: 'oyun', baslik: "Oyun Dünyası", renk: "#FF9F43" },
  { id: 'ataturk', baslik: "Atatürk'ü Tanımak", renk: "#EF5777" },
  { id: 'duygu', baslik: "Duygularımı Tanıyorum", renk: "#575fcf" },
  { id: 'gelenek', baslik: "Geleneklerimiz", renk: "#0be881" },
  { id: 'iletisim', baslik: "İletişim ve Sosyal İlişkiler", renk: "#ffc048" },
  { id: 'saglik', baslik: "Sağlıklı Yaşıyorum", renk: "#05c46b" }
];

export const DUZ_YAZI_TURLERI = [
  {
    id: 'betimleme',
    baslik: 'Betimleme Paragrafı',
    aciklama: 'Bir karakteri detaylıca anlat.',
    bilgiBaslik: 'Betimleme Paragrafı Nedir?',
    bilgiMetni: 'Betimleme paragrafı, bir kişiyi, yeri, nesneyi ya da bir durumu okuyanın zihninde canlandıracak şekilde ayrıntılı olarak anlatan paragraftır. Bu tür paragraflarda amaç, okura adeta bir resim çizmek gibidir. Yazar, renkleri, şekilleri, sesleri, kokuları ve diğer özellikleri anlatır; böylece okur, anlatılan şeyi kendi gözleriyle görüyormuş gibi hisseder.',
    ornekBaslik: "Betimleme Örneği (Snoopy)",
    ornekMetin: 'Snoopy, küçük beyaz gövdesi ve siyah kulaklarıyla tanınan sevimli bir köpektir. Yürüyüşü hafifçe sallantılıdır ve çoğu zaman yüzünde kendinden emin, hayalperest bir ifade bulunur. Kırmızı kulübesinin tepesinde uzanmayı sever; orası onun hem düşünme köşesi hem de hayal dünyasına açılan kapısıdır. Bazen bir pilot, bazen bir yazar, bazen de filozof olur. Gerçeklerden çok hayallerde yaşamayı seven Snoopy, sakin ama bir o kadar da renkli kişiliğiyle etrafındakilere neşeli ve sıcak bir enerji yayar.',
    resim: snoopyImg
  },
  {
    id: 'oykuleyici',
    baslik: 'Öyküleyici Paragraf',
    aciklama: 'Bir olayı hikaye et.',
    bilgiBaslik: 'Öyküleyici Paragraf Nedir?',
    bilgiMetni: 'Öyküleyici paragraflar, yaşanmış veya hayal ürünü olayların anlatıldığı paragraflardır. Bu paragraflarda olayın kimler tarafından, nerede ve ne zaman yaşandığına yer verilir. Bu tür paragraflar tek başlarına kullanılabildikleri gibi birden fazla olayın yer aldığı masal, hikâye ve romanların içinde de karşımıza çıkar.',
    ornekBaslik: "Öyküleyici Paragraf Örneği (Ali ve Mırmır)",
    ornekMetin: 'Sabah güneşinin ince ince süzüldüğü o serin havada, Ali her zamanki gibi okul yoluna koyuldu. Sokakların henüz kalabalıklaşmamış olması ona huzur veriyordu. Köşeyi döndüğünde, mahallenin yaşlı kedisi Mırmır\'ın yolun ortasında oturduğunu gördü. Yanına eğilip kediyi okşarken zamanın nasıl geçtiğini fark etmedi. Bir anda okul zilinin çaldığını duyunca paniğe kapıldı. Çantasını sırtına daha sıkı yerleştirip hızlı adımlarla koşmaya başladı. Nefes nefese okula vardığında, arkadaşlarının onu el sallayarak karşıladığını görünce rahatladı.',
    resim: aliMirmirImg
  },
  {
    id: 'sirali',
    baslik: 'Sıralı-Kronolojik Metin',
    aciklama: 'Olayları oluş sırasına göre anlat.',
    bilgiBaslik: 'Sıralı-Kronolojik Metin Nedir?',
    bilgiMetni: 'Sıralı-kronolojik metin yapısı, bir olayın zaman içindeki gelişimini adım adım anlatan metin türüdür. Olaylar ilk önce olan, sonra gerçekleşen ve en son meydana gelen biçiminde düzenlenir. Amaç, okurun olayların hangi sırayla gerçekleştiğini kolayca anlamasını sağlamaktır. Bu metinlerde genellikle "önce, ardından, daha sonra, bir süre sonra, en sonunda…" gibi zaman belirten ifadeler bulunur. Anlatım, tıpkı bir film şeridi gibi olayların baştan sona akışını gösterir.',
    ornekBaslik: "Sıralı-kronolojik Metin Örneği (Sirke Deneyi)",
    ornekMetin: 'Sirke ile karbonatın tepkimesini incelemek için önce boş bir bardağın içine iki kaşık karbonat koydum. Ardından yavaşça üzerine yarım çay bardağı sirke döktüm. Sirke karbonatla temas eder etmez kabarcıklar hızla yükselmeye başladı ve bardaktan taşacak kadar köpük oluştu. Köpürmenin birkaç saniye içinde arttığını, daha sonra yavaş yavaş azaldığını gözlemledim. Son olarak köpük tamamen söndüğünde, bardağın dibinde beyaz bir tortu kaldığını fark ettim. Böylece deney, karbondioksit gazının oluştuğunu açıkça göstererek tamamlandı.',
    resim: deneyImg
  },
  {
    id: 'tanitma',
    baslik: 'Tanıtma Paragrafı',
    aciklama: 'Bir nesneyi veya kavramı tanıt.',
    bilgiBaslik: 'Tanıtma Paragrafı Nedir?',
    bilgiMetni: 'Tanıtma paragrafı, bir kişiyi, nesneyi, yeri, kurumu, olayı ya da kavramı tanıtmak, yani okuyucuya o şey hakkında bilgi vermek amacıyla yazılan paragraftır. Bu paragraf türünde amaç, tanıtılan varlığın özelliklerini, işlevini, önemini, kullanım alanını veya genel niteliklerini açıklamaktır. Yazar; nesnel, açıklayıcı ve bilgilendirici bir anlatım kullanır. Hikâye etme ya da zaman akışı yoktur.',
    ornekBaslik: "Tanıtma Paragrafı Örnek (Akıllı Telefonlar)",
    ornekMetin: 'Akıllı telefonlar, modern yaşamın vazgeçilmez iletişim araçlarından biri hâline gelmiştir. İnternet bağlantısı, fotoğraf ve video çekme, mesajlaşma, oyun oynama, müzik dinleme, harita kullanma ve çeşitli uygulamalara erişme gibi pek çok işlevi tek bir cihazda toplar. Bu sayede kullanıcılar hem işlerini hızlı ve pratik bir şekilde halledebilir hem de gün içinde bilgiye anında ulaşma fırsatı yakalar. Ayrıca sosyal medya uygulamaları aracılığıyla arkadaşlarıyla iletişim kurabilir, gündemi takip edebilir ve keyifli vakit geçirebilirler. Kısacası akıllı telefonlar, hem günlük hayatı kolaylaştıran hem de insanların eğlence ve sosyal etkileşim ihtiyaçlarını karşılayan çok yönlü teknolojik araçlardır.',
    resim: telefonImg
  }
];

export const BILGI_KARTLARI = DUZ_YAZI_TURLERI.reduce((acc, tur) => {
  acc[tur.id] = tur;
  return acc;
}, {});

export const TASLAK_BILGI_METINLERI = BILGI_KARTLARI;

export const NASIL_CALISIR_METNI = [
  {
    baslik: "Planlama:",
    icerik: "Yazma öncesi hazırlık yapmaktır. Planlamada önce metnin konusunu seçeriz, sonra konuyla ilgili bilgi toplarız veya var olan bilgilerimizi düzenleriz. Metinde bu bilgilere nasıl ve hangi sırayla yer vereceğimizi belirleriz. Yazımızın dil ve anlatım özelliklerine karar veririz."
  },
  {
    baslik: "Taslak (Metin) Oluşturma:",
    icerik: "Yaptığımız plana göre yazımızı oluşturduğumuz stratejidir. Burada kusursuz yazmak değil, metnin ana yapısını oluşturmak önemlidir. Bu aşamada rahat davranabiliriz çünkü taslağımızı gözden geçirme stratejisiyle düzenleyeceğiz."
  },
  {
    baslik: "Gözden Geçirme:",
    icerik: "Taslağımızı hem içerik hem yazım ve noktalama yönünden düzenlediğimiz aşamadır. Bu aşamada taslağımızı birkaç kez okumak önemlidir. Belirlediğimiz hataları düzeltip yazımızda gerekli gördüğümüz yerlerde ekleme ve çıkarmalar yapabiliriz."
  },
  {
    baslik: "Paylaşma:",
    icerik: "Yazdığımız metni nasıl ve kimlerle paylaşacağımıza karar vererek gerekli çalışmaları yaptığımız stratejidir."
  }
];

// --- YENİ EKLENEN KISIM: ŞİİR TEMA GÖRSELLERİ ---
const temaResimleri = import.meta.glob('./assets/temalar/**/*.jpg', { eager: true });

export const getTemaResmi = (temaBaslik, resimNo) => {
  let klasor = "";
  if (temaBaslik.includes("Oyun")) klasor = "oyun";
  else if (temaBaslik.includes("Atatürk")) klasor = "ataturk";
  else if (temaBaslik.includes("Duygu")) klasor = "duygu";
  else if (temaBaslik.includes("Gelenek")) klasor = "gelenek";
  else if (temaBaslik.includes("İletişim")) klasor = "iletisim";
  else if (temaBaslik.includes("Sağlıklı")) klasor = "saglik";

  const yol = `./assets/temalar/${klasor}/${resimNo}.jpg`;
  return temaResimleri[yol]?.default || null;
};