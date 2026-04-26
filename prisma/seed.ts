import { prisma } from "../lib/prisma";

async function main() {
  // seed를 여러 번 실행해도 중복 데이터가 쌓이지 않게 초기화
  await prisma.bookOrder.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "MOTIF Demo User",
      bio: "좋아하는 것을 주제별 컬렉션으로 남기는 사람",
    },
  });

  // collection1 - 비 오는 날 생각나는 것들
  await prisma.collection.create({
    data: {
      ownerId: user.id,
      title: "비 오는 날 생각나는 것들",
      slug: "rainy-day-things",
      coverImageUrl: "/samples/c1.jpg",
      intro: "비 냄새를 맡고 빗소리를 들을 때 나는 무엇을 떠올릴까",
      outro: "",
      visibility: "PUBLIC",
      items: {
        create: [
          {
            type: "MUSIC",
            title: "RADWIMPS - 愛にできることはまだあるかい",
            note: "날씨의 아이 장면이 그대로 생각나는 노래",
            imageUrl: "/samples/radwimps.jpg",
            position: 2,
          },
          {
            type: "FOOD",
            title: "닭도리탕",
            note: "비 오는 날엔 역시 얼큰한 맛과 흰 쌀밥이 생각난다.",
            position: 3,
          },
          { 
            type: "BOOK",
            title: "날씨의 아이",
            note: "빗소리를 들으면 날씨의 아이 n회차를 하고 싶어지는 법...",
            imageUrl: "/samples/tenki2.jpg",
            position: 1,
          },
        ],
      },
    }
  });


  // collection2 - 혼자 있는 주말에 하고 싶은 것들
    await prisma.collection.create({
    data: {
      ownerId: user.id,
      title: "혼자 있는 주말에 하고 싶은 것들",
      slug: "quiet-weekend",
      coverImageUrl: "/samples/c2.jpg",
      intro: "나른한 주말 나를 즐겁게 하는 것들은 어떤 게 있을까.",
      outro: "",
      visibility: "PUBLIC",
      items: {
        create: [
          {
            type: "OTHER",
            title: "모여봐요 동물의 숲",
            note: "나는 동물의 숲 같이 힐링되는 게임이 너무 좋다. 이쁘게 섬을 꾸밀 수 있는 것 또한 좋다. 무엇보다도 좋은 건 너무 귀여운 나의 섬 주민들.",
            imageUrl: "/samples/acnh.jpg",
            position: 1,
          },
          {
            type: "OTHER",
            title: "밤 산책",
            note: "요즘 같이 선선한 날씨에 좋아하는 음악을 들으며 동네를 산책하는 건 너무 좋다. 산책하며 골목의 숨은 가게들을 발견하면 기쁨이 2배",
            position: 2,
          },
          {
            type: "OTHER",
            title: "OTT 정주행",
            note: "주말동안 OTT 정주행을 하는 건 정말 큰 행복이야. 특히 맛있는 음식과 함께라면 더욱 더",
            position: 3,
          },
        ],
      },
    }
  });

    // collection3 - 오늘 먹고 내일 또 먹고 싶은 음식들
    await prisma.collection.create({
    data: {
      ownerId: user.id,
      title: "오늘 먹고 내일 또 먹고 싶은 음식들",
      slug: "favorite-foods",
      coverImageUrl: "/samples/c3.jpg",
      intro: "내가 올드보이의 최민식이라면, 이 음식 하나로도 버텨낼 수 있지 않을까.",
      outro: "내일 또 먹어야지",
      visibility: "PUBLIC",
      items: {
        create: [
          {
            type: "FOOD",
            title: "쯔란 파스타",
            note: "일주일에 3번은 먹는 쯔란 파스타... 진짜 너무 맛있고 또 맛있다",
            imageUrl: "/samples/pasta.jpg",
            position: 1,
          },
          {
            type: "FOOD",
            title: "닭도리탕",
            note: "엽기닭볶음탕... 곱도리탕.. 나는 도리도리탕들이 왜이리 좋을까 ㅠ ㅅ ㅠ ",
            position: 2,
          },
        ],
      },
    }
  });


  console.log("Seed data created!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });