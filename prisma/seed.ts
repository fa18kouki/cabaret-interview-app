import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 シードデータの投入を開始します...");

  // ==================== 店舗ユーザー + 店舗プロフィール ====================

  const stores = [
    {
      email: "seed-store-luna@example.com",
      store: {
        name: "Club LUNA",
        area: "六本木",
        address: "東京都港区六本木3-10-5",
        description:
          "六本木の一等地に佇む高級キャバクラ。落ち着いた内装と上質な接客で、企業役員や著名人のお客様に愛されています。未経験でも丁寧に指導いたします。",
        photos: [],
        businessHours: "20:00〜翌1:00",
        salarySystem: "時給5,000円〜 + 各種バック",
        benefits: [
          "送迎あり",
          "日払いOK",
          "ヘアメイク完備",
          "ドレス貸出無料",
          "ノルマなし",
        ],
        isVerified: true,
      },
    },
    {
      email: "seed-store-stella@example.com",
      store: {
        name: "Girls Bar STELLA",
        area: "渋谷",
        address: "東京都渋谷区道玄坂2-15-1",
        description:
          "渋谷駅から徒歩3分のカジュアルなガールズバー。20代前半のスタッフが中心で、アットホームな雰囲気が自慢です。Wワーク・学生さん歓迎！",
        photos: [],
        businessHours: "18:00〜翌2:00",
        salarySystem: "時給3,000円〜 + ドリンクバック",
        benefits: ["日払いOK", "交通費支給", "自由出勤", "髪型・ネイル自由"],
        isVerified: true,
      },
    },
    {
      email: "seed-store-amour@example.com",
      store: {
        name: "Lounge AMOUR",
        area: "銀座",
        address: "東京都中央区銀座7-5-12",
        description:
          "銀座の老舗ラウンジ。30代以上の落ち着いた大人の女性も活躍中。会話力を重視した採用で、経験者優遇。週1〜OK。",
        photos: [],
        businessHours: "19:00〜翌0:00",
        salarySystem: "時給4,000円〜 + 指名バック + 同伴バック",
        benefits: [
          "送迎あり",
          "日払いOK",
          "週1OK",
          "30代活躍中",
          "ママ在籍",
        ],
        isVerified: true,
      },
    },
  ];

  const createdStores: { userId: string; storeId: string }[] = [];

  for (const s of stores) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        role: "STORE",
        emailVerified: new Date(),
      },
    });

    const store = await prisma.store.upsert({
      where: { userId: user.id },
      update: s.store,
      create: {
        userId: user.id,
        ...s.store,
      },
    });

    createdStores.push({ userId: user.id, storeId: store.id });
    console.log(`  ✅ 店舗: ${s.store.name}`);
  }

  // ==================== キャストユーザー + キャストプロフィール ====================

  const casts = [
    {
      email: "seed-cast-airi@example.com",
      cast: {
        nickname: "あいり",
        age: 22,
        description:
          "新宿・歌舞伎町エリアで3年の経験があります。明るい性格で場を盛り上げるのが得意です！",
        photos: [],
        desiredAreas: ["新宿", "歌舞伎町"],
        desiredHourlyRate: 5000,
        desiredMonthlyIncome: 500000,
        availableDaysPerWeek: 4,
        totalExperienceYears: 3,
        previousHourlyRate: 4500,
        monthlySales: 800000,
        monthlyNominations: 15,
        alcoholTolerance: "STRONG" as const,
        preferredAtmosphere: ["ワイワイ系", "にぎやか"],
        preferredClientele: ["若い客層", "サラリーマン"],
        rank: "GOLD" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
      },
      experiences: [
        { area: "歌舞伎町", businessType: "CABARET" as const, durationMonths: 24 },
        { area: "新宿", businessType: "GIRLS_BAR" as const, durationMonths: 12 },
      ],
    },
    {
      email: "seed-cast-misaki@example.com",
      cast: {
        nickname: "みさき",
        age: 24,
        description:
          "六本木・銀座エリアの高級店で5年勤務。指名本数トップクラスの実績あり。接客には自信があります。",
        photos: [],
        desiredAreas: ["六本木", "銀座"],
        desiredHourlyRate: 8000,
        desiredMonthlyIncome: 1000000,
        availableDaysPerWeek: 5,
        totalExperienceYears: 5,
        previousHourlyRate: 7000,
        monthlySales: 2000000,
        monthlyNominations: 30,
        alcoholTolerance: "MODERATE" as const,
        preferredAtmosphere: ["落ち着いた店", "高級感"],
        preferredClientele: ["企業役員", "富裕層"],
        rank: "PLATINUM" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
        birthdaySales: 5000000,
        hasVipClients: true,
        vipClientDescription: "上場企業役員のお客様が複数名",
        socialFollowers: 15000,
      },
      experiences: [
        { area: "六本木", businessType: "CLUB" as const, durationMonths: 36 },
        { area: "銀座", businessType: "LOUNGE" as const, durationMonths: 24 },
      ],
    },
    {
      email: "seed-cast-sakura@example.com",
      cast: {
        nickname: "さくら",
        age: 20,
        description:
          "渋谷エリアでガールズバー経験1年。大学生との両立をしています。笑顔と元気が取り柄です！",
        photos: [],
        desiredAreas: ["渋谷", "恵比寿"],
        desiredHourlyRate: 3500,
        desiredMonthlyIncome: 200000,
        availableDaysPerWeek: 3,
        totalExperienceYears: 1,
        previousHourlyRate: 3000,
        monthlySales: 300000,
        monthlyNominations: 5,
        alcoholTolerance: "WEAK" as const,
        preferredAtmosphere: ["カジュアル", "アットホーム"],
        preferredClientele: ["若い客層"],
        rank: "SILVER" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
      },
      experiences: [
        { area: "渋谷", businessType: "GIRLS_BAR" as const, durationMonths: 12 },
      ],
    },
    {
      email: "seed-cast-rena@example.com",
      cast: {
        nickname: "れな",
        age: 23,
        description:
          "銀座・赤坂の落ち着いた雰囲気のお店で4年の経験。会話力に自信があり、リピーターのお客様が多いです。",
        photos: [],
        desiredAreas: ["銀座", "赤坂"],
        desiredHourlyRate: 6000,
        desiredMonthlyIncome: 700000,
        availableDaysPerWeek: 4,
        totalExperienceYears: 4,
        previousHourlyRate: 5500,
        monthlySales: 1200000,
        monthlyNominations: 20,
        alcoholTolerance: "MODERATE" as const,
        preferredAtmosphere: ["落ち着いた店", "大人の雰囲気"],
        preferredClientele: ["企業役員", "年配のお客様"],
        rank: "GOLD" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
      },
      experiences: [
        { area: "銀座", businessType: "LOUNGE" as const, durationMonths: 30 },
        { area: "赤坂", businessType: "CLUB" as const, durationMonths: 18 },
      ],
    },
    {
      email: "seed-cast-yui@example.com",
      cast: {
        nickname: "ゆい",
        age: 21,
        description:
          "池袋エリアで半年ほど勤務しました。まだ経験は浅いですが、やる気は誰にも負けません！",
        photos: [],
        desiredAreas: ["池袋", "新宿"],
        desiredHourlyRate: 3500,
        desiredMonthlyIncome: 250000,
        availableDaysPerWeek: 3,
        totalExperienceYears: 0,
        previousHourlyRate: 3000,
        monthlySales: 200000,
        monthlyNominations: 3,
        alcoholTolerance: "WEAK" as const,
        preferredAtmosphere: ["アットホーム", "にぎやか"],
        preferredClientele: ["サラリーマン", "若い客層"],
        rank: "BRONZE" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
      },
      experiences: [
        { area: "池袋", businessType: "CABARET" as const, durationMonths: 6 },
      ],
    },
    {
      email: "seed-cast-mao@example.com",
      cast: {
        nickname: "まお",
        age: 25,
        description:
          "六本木・銀座の最高級店で7年のキャリア。バースデーイベントでは500万超えの実績。SNSフォロワー2万人超。",
        photos: [],
        desiredAreas: ["六本木", "銀座"],
        desiredHourlyRate: 10000,
        desiredMonthlyIncome: 2000000,
        availableDaysPerWeek: 5,
        totalExperienceYears: 7,
        previousHourlyRate: 9000,
        monthlySales: 3000000,
        monthlyNominations: 40,
        alcoholTolerance: "STRONG" as const,
        preferredAtmosphere: ["高級感", "落ち着いた店"],
        preferredClientele: ["富裕層", "企業役員", "著名人"],
        rank: "S_RANK" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
        birthdaySales: 8000000,
        hasVipClients: true,
        vipClientDescription: "上場企業CEO、芸能関係者など多数",
        socialFollowers: 25000,
      },
      experiences: [
        { area: "六本木", businessType: "CLUB" as const, durationMonths: 48 },
        { area: "銀座", businessType: "CLUB" as const, durationMonths: 36 },
      ],
    },
    {
      email: "seed-cast-hinata@example.com",
      cast: {
        nickname: "ひなた",
        age: 19,
        description:
          "完全未経験ですが、接客業に興味があり応募しました。渋谷エリア希望です。",
        photos: [],
        desiredAreas: ["渋谷"],
        desiredHourlyRate: 3000,
        desiredMonthlyIncome: 150000,
        availableDaysPerWeek: 2,
        totalExperienceYears: 0,
        alcoholTolerance: "NONE" as const,
        preferredAtmosphere: ["カジュアル", "アットホーム"],
        preferredClientele: ["若い客層"],
        rank: "UNRANKED" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: false,
      },
      experiences: [],
    },
    {
      email: "seed-cast-riko@example.com",
      cast: {
        nickname: "りこ",
        age: 26,
        description:
          "歌舞伎町と池袋で2年ほど経験があります。しっかり稼ぎたいので出勤日数も多めにできます。",
        photos: [],
        desiredAreas: ["歌舞伎町", "池袋"],
        desiredHourlyRate: 4500,
        desiredMonthlyIncome: 400000,
        availableDaysPerWeek: 5,
        totalExperienceYears: 2,
        previousHourlyRate: 4000,
        monthlySales: 500000,
        monthlyNominations: 10,
        alcoholTolerance: "MODERATE" as const,
        preferredAtmosphere: ["にぎやか", "ワイワイ系"],
        preferredClientele: ["サラリーマン"],
        rank: "SILVER" as const,
        idVerified: true,
        idVerificationStatus: "VERIFIED" as const,
        diagnosisCompleted: true,
        diagnosisCompletedAt: new Date(),
      },
      experiences: [
        { area: "歌舞伎町", businessType: "CABARET" as const, durationMonths: 18 },
        { area: "池袋", businessType: "GIRLS_BAR" as const, durationMonths: 6 },
      ],
    },
  ];

  const createdCasts: { userId: string; castId: string; nickname: string }[] =
    [];

  for (const c of casts) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        role: "CAST",
        emailVerified: new Date(),
      },
    });

    const cast = await prisma.cast.upsert({
      where: { userId: user.id },
      update: c.cast,
      create: {
        userId: user.id,
        ...c.cast,
      },
    });

    // 既存の経験データを削除してから再作成
    await prisma.castExperience.deleteMany({ where: { castId: cast.id } });
    for (const exp of c.experiences) {
      await prisma.castExperience.create({
        data: {
          castId: cast.id,
          ...exp,
        },
      });
    }

    createdCasts.push({
      userId: user.id,
      castId: cast.id,
      nickname: c.cast.nickname,
    });
    console.log(`  ✅ キャスト: ${c.cast.nickname} (${c.cast.rank})`);
  }

  // ==================== オファー ====================

  const offerData = [
    {
      storeIndex: 0, // Club LUNA
      castIndex: 0, // あいり
      message:
        "あいりさん、はじめまして！Club LUNAの採用担当です。プロフィールを拝見して、ぜひ一度お会いしたいと思いました。体験入店からでもOKですので、お気軽にご連絡ください！",
      status: "PENDING" as const,
      daysAgo: 1,
    },
    {
      storeIndex: 1, // Girls Bar STELLA
      castIndex: 2, // さくら
      message:
        "さくらさん、こんにちは！渋谷のGirls Bar STELLAです。学生さんも多いお店なので、きっと楽しく働けると思います。シフトの相談もお気軽にどうぞ♪",
      status: "ACCEPTED" as const,
      daysAgo: 5,
    },
    {
      storeIndex: 2, // Lounge AMOUR
      castIndex: 1, // みさき
      message:
        "みさきさん、Lounge AMOURの店長です。銀座エリアでの豊富なご経験に興味を持ちました。当店の雰囲気にもマッチすると思います。ぜひ面接のお時間をいただけますか？",
      status: "REJECTED" as const,
      daysAgo: 10,
    },
  ];

  const createdOffers: { id: string; storeIndex: number; castIndex: number }[] =
    [];

  for (const o of offerData) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const offer = await prisma.offer.create({
      data: {
        storeId: createdStores[o.storeIndex].storeId,
        castId: createdCasts[o.castIndex].castId,
        message: o.message,
        status: o.status,
        expiresAt,
        createdAt: new Date(Date.now() - o.daysAgo * 24 * 60 * 60 * 1000),
      },
    });

    createdOffers.push({
      id: offer.id,
      storeIndex: o.storeIndex,
      castIndex: o.castIndex,
    });
    console.log(
      `  ✅ オファー: ${stores[o.storeIndex].store.name} → ${casts[o.castIndex].cast.nickname} (${o.status})`
    );
  }

  // ==================== マッチ + メッセージ ====================

  // ACCEPTED オファー（さくら ↔ Girls Bar STELLA）からマッチを作成
  const acceptedOffer = createdOffers.find((o) => o.storeIndex === 1);
  if (acceptedOffer) {
    const match = await prisma.match.upsert({
      where: {
        castId_storeId: {
          castId: createdCasts[acceptedOffer.castIndex].castId,
          storeId: createdStores[acceptedOffer.storeIndex].storeId,
        },
      },
      update: { status: "ACCEPTED" },
      create: {
        castId: createdCasts[acceptedOffer.castIndex].castId,
        storeId: createdStores[acceptedOffer.storeIndex].storeId,
        status: "ACCEPTED",
      },
    });

    // メッセージを投入
    const messages = [
      {
        senderId: createdStores[acceptedOffer.storeIndex].userId,
        content:
          "さくらさん、オファーを受けていただきありがとうございます！面接の日程を相談させてください。",
        minutesAgo: 120,
      },
      {
        senderId: createdCasts[acceptedOffer.castIndex].userId,
        content:
          "こちらこそありがとうございます！今週の木曜日か金曜日の夕方はいかがでしょうか？",
        minutesAgo: 90,
      },
      {
        senderId: createdStores[acceptedOffer.storeIndex].userId,
        content:
          "木曜日18時でいかがですか？渋谷駅ハチ公口でお待ちしています。",
        minutesAgo: 60,
      },
      {
        senderId: createdCasts[acceptedOffer.castIndex].userId,
        content: "木曜日18時、了解しました！よろしくお願いいたします。",
        minutesAgo: 30,
      },
    ];

    // 既存メッセージを削除して再作成
    await prisma.message.deleteMany({ where: { matchId: match.id } });
    for (const msg of messages) {
      await prisma.message.create({
        data: {
          matchId: match.id,
          senderId: msg.senderId,
          content: msg.content,
          isRead: true,
          createdAt: new Date(Date.now() - msg.minutesAgo * 60 * 1000),
        },
      });
    }

    console.log(`  ✅ マッチ + メッセージ: さくら ↔ Girls Bar STELLA`);
  }

  console.log("\n🎉 シードデータの投入が完了しました！");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ シードデータの投入に失敗しました:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
