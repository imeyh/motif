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

  // collection1 - 여름날 자주 듣는 노래
  await prisma.collection.create({
    data: {
      ownerId: user.id,
      title: "어느 여름날의 나를 떠올리게 하는 노래들",
      slug: "summer-song",
      coverImageUrl: "/samples/c1.jpg",
      intro: "지금이 어떤 계절이든, 틀어두면 잠깐 여름에 머무는 느낌의 노래들.",
      outro: "",
      visibility: "PUBLIC",
      items: {
        create: [
          {
            type: "MUSIC",
            title: "소년달 - 잠들지 못하는 청춘들에게",
            note: "이 노래를 들으면 여름밤 매미 소리가 들리는 것만 같아.",
            imageUrl: "/samples/boyzmoon.jpg",
            position: 1,
          },
          {
            type: "MUSIC",
            title: "Mrs. GREEN APPLE - 青と夏",
            note: "일본의 청춘과 여름이 이 한 곡에 가득 ... 다녀보지도 않은 일본 고등학교 생활이 떠오른다",
            imageUrl: "/samples/greenapple.jpg",
            position: 2,
          },
          { 
            type: "MUSIC",
            title: "RADWIMPS - Grand Escape",
            note: "여름엔 역시 날씨의 아이 n회차 다시보기. 다시보고 나면 이 노래를 듣는 걸 안할 수가 없다.",
            imageUrl: "/samples/tenki1.jpg",
            position: 3,
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