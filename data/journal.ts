export type JournalSection = {
  heading: string;
  paragraphs: string[];
  quote?: string;
};

export type JournalImage = {
  src: string;
  alt: string;
  caption: string;
  afterSection: number;
};

export type JournalArticle = {
  slug: string;
  index: string;
  category: string;
  date: string;
  readingTime: string;
  title: string;
  dek: string;
  sections: JournalSection[];
  images: JournalImage[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "ai-commercial-production",
    index: "01",
    category: "PRODUCTION NOTE",
    date: "2026.07.26",
    readingTime: "6 MIN READ",
    title: "AI 광고 영상 제작,\n무엇이 달라졌을까?",
    dek: "생성 버튼 하나로 광고가 완성되는 시대는 오지 않았다. 대신 아이디어를 장면으로 검증하고, 제작의 선택지를 빠르게 확장하는 새로운 방식이 시작됐다.",
    images: [
      {
        src: "/journal/ai-commercial-preproduction.png",
        alt: "스토리보드와 조명 설계를 검토하는 AI 영상 프리프로덕션 스튜디오",
        caption: "완성 속도보다 먼저 달라진 것은 아이디어를 검증하는 속도다.",
        afterSection: 0,
      },
      {
        src: "/journal/ai-commercial-hybrid-production.png",
        alt: "실물 미니어처와 가상 배경을 함께 촬영하는 하이브리드 프로덕션",
        caption: "실사, 3D, 생성 이미지는 장면의 목적에 따라 하나의 제작 방식으로 결합된다.",
        afterSection: 3,
      },
    ],
    sections: [
      {
        heading: "도구는 빨라졌고, 결정은 더 중요해졌다",
        paragraphs: [
          "AI 영상 제작의 가장 큰 변화는 완성 속도보다 탐색 속도에 있다. 촬영 전에 여러 미술 방향과 카메라 움직임을 비교하고, 제품이 놓일 공간과 빛을 빠르게 시험할 수 있다.",
          "하지만 선택지가 많아질수록 무엇을 버리고 무엇을 남길지 판단하는 디렉션이 중요해진다. 결과의 품질은 모델 이름보다 기획, 레퍼런스 설계, 샷 구성과 일관성 관리에서 결정된다.",
        ],
        quote: "AI는 제작자의 결정을 대신하지 않는다. 더 많은 결정을 더 이른 순간에 가능하게 한다.",
      },
      {
        heading: "프롬프트보다 먼저 필요한 것",
        paragraphs: [
          "좋은 광고는 제품의 기능을 나열하지 않는다. 누가, 어떤 순간에, 왜 이 제품을 선택해야 하는지를 하나의 감각으로 압축한다. 따라서 첫 단계는 프롬프트 작성이 아니라 메시지와 관객, 매체를 정리하는 일이다.",
          "프로덕션 단계에서는 이를 비주얼 바이블로 변환한다. 인물, 공간, 렌즈, 조명, 색, 움직임의 기준을 먼저 고정하면 여러 생성 도구를 사용해도 하나의 작품처럼 연결할 수 있다.",
        ],
      },
      {
        heading: "한 컷이 아니라 시퀀스를 만든다",
        paragraphs: [
          "인상적인 이미지 한 장과 완성된 영상 사이에는 큰 간격이 있다. 앞뒤 장면의 시선 방향, 동작의 연속성, 화면 크기 변화, 편집 리듬이 설계되지 않으면 멋진 컷도 서로 연결되지 않는다.",
          "그래서 AI 영상 역시 콘티와 샷 리스트가 필요하다. 와이드에서 미디엄, 디테일로 이어지는 정보의 순서와 움직임의 방향을 정한 뒤 각 장면을 생성해야 한다.",
        ],
      },
      {
        heading: "AI와 실사의 경계는 프로젝트가 정한다",
        paragraphs: [
          "모든 장면을 AI로 만들 필요는 없다. 제품의 정확한 형태와 질감이 중요한 컷은 실사나 3D가 유리하고, 현실에서 촬영하기 어려운 공간과 전환은 AI가 강하다.",
          "좋은 제작 방식은 기술을 과시하는 방식이 아니라 장면마다 가장 설득력 있는 도구를 선택하는 방식이다. 최종 화면에서 관객이 느껴야 할 것은 기술이 아니라 브랜드의 태도다.",
        ],
      },
    ],
  },
  {
    slug: "consistency-is-direction",
    index: "02",
    category: "DIRECTION",
    date: "2026.07.26",
    readingTime: "5 MIN READ",
    title: "AI 영상의 일관성은\n어떻게 만드는가",
    dek: "같은 인물과 공간을 반복 생성하는 것만으로는 부족하다. 관객이 하나의 세계라고 믿게 만드는 것은 형태보다 연출의 규칙이다.",
    images: [
      {
        src: "/journal/consistency-contact-sheet.png",
        alt: "하나의 인물과 공간이 일관된 시각 언어로 이어지는 시네마틱 콘택트 시트",
        caption: "일관성은 모든 프레임이 같은 것이 아니라, 같은 규칙이 계속 작동하는 것이다.",
        afterSection: 0,
      },
      {
        src: "/journal/consistency-postproduction.png",
        alt: "영상과 사운드를 하나의 시퀀스로 다듬는 후반 작업실",
        caption: "컬러, 편집 리듬과 사운드는 서로 다른 소스를 하나의 세계로 묶는다.",
        afterSection: 2,
      },
    ],
    sections: [
      {
        heading: "일관성은 동일함이 아니라 연결감이다",
        paragraphs: [
          "모든 프레임의 얼굴과 의상이 완벽히 같아도 렌즈와 빛, 카메라 높이가 이유 없이 바뀌면 장면은 분리되어 보인다. 반대로 작은 형태 변화가 있어도 시선과 동작, 색의 흐름이 이어지면 관객은 하나의 장면으로 받아들인다.",
          "따라서 일관성 관리는 캐릭터 시트에만 머물지 않는다. 화면비, 렌즈군, 조명의 방향, 주조색과 보조색, 카메라의 운동 규칙을 함께 정의해야 한다.",
        ],
      },
      {
        heading: "변하지 않을 것과 변해도 될 것",
        paragraphs: [
          "프로젝트를 시작할 때 고정 요소와 가변 요소를 구분한다. 인물의 핵심 특징, 제품 형태, 브랜드 색과 공간의 건축 언어는 고정한다. 날씨와 시간, 표정과 카메라 거리는 장면의 목적에 따라 변화시킨다.",
          "이 구분이 없으면 모든 차이를 오류로 취급하거나, 반대로 중요한 변화까지 허용하게 된다. 일관성은 무조건적인 통제가 아니라 우선순위의 설계다.",
        ],
        quote: "같은 세계는 모든 것이 같은 세계가 아니라, 같은 규칙이 작동하는 세계다.",
      },
      {
        heading: "편집이 마지막 일관성을 만든다",
        paragraphs: [
          "생성 단계에서 해결되지 않은 미세한 차이는 편집과 컬러 그레이딩에서 정리할 수 있다. 컷의 길이, 전환 지점, 사운드의 연속성이 이미지 사이의 간극을 줄인다.",
          "특히 사운드는 서로 다른 소스의 화면을 하나의 공간으로 묶는 강력한 요소다. 동일한 공간음과 운동의 충격음을 이어주면 장면의 물리성이 살아난다.",
        ],
      },
    ],
  },
  {
    slug: "from-image-to-sequence",
    index: "03",
    category: "WORKFLOW",
    date: "2026.07.26",
    readingTime: "7 MIN READ",
    title: "한 장의 이미지를\n장면으로 확장하는 법",
    dek: "좋은 키 비주얼을 얻은 다음 무엇을 해야 할까. 이미지를 반복해서 움직이는 대신, 그 이미지가 속한 세계의 앞과 뒤를 설계하는 방법.",
    images: [
      {
        src: "/journal/image-to-sequence.png",
        alt: "하나의 키 이미지가 전후 사건을 가진 세 장면으로 확장되는 시퀀스 설계",
        caption: "중심 프레임의 이전과 이후를 설계하면 한 장의 이미지에 시간이 생긴다.",
        afterSection: 1,
      },
      {
        src: "/journal/motion-and-sound.png",
        alt: "카메라 트랙과 음파 조형물로 표현한 움직임과 사운드의 시간",
        caption: "움직임의 이유와 소리의 위치가 장면의 시간을 완성한다.",
        afterSection: 3,
      },
    ],
    sections: [
      {
        heading: "이미지 안에서 사건을 찾는다",
        paragraphs: [
          "키 비주얼에는 이미 사건의 단서가 있다. 인물의 시선, 바람의 방향, 빛이 들어오는 위치, 화면 밖을 향하는 움직임을 읽으면 다음 장면이 무엇이어야 하는지 추론할 수 있다.",
          "카메라를 무작정 움직이기 전에 장면 안에서 무엇이 변해야 하는지 결정한다. 인물이 고개를 드는지, 제품에 빛이 닿는지, 공간이 열리는지가 먼저다.",
        ],
      },
      {
        heading: "앞 장면과 뒤 장면을 만든다",
        paragraphs: [
          "하나의 이미지를 중심 프레임으로 두고 그 직전과 직후의 상태를 설계한다. 직전에는 정보가 덜 보이고, 중심에서는 핵심이 드러나며, 직후에는 행동의 결과가 남도록 구성한다.",
          "이렇게 세 개의 상태를 만들면 단순한 이미지 애니메이션이 아니라 시작과 변화, 도착이 있는 짧은 시퀀스가 된다.",
        ],
        quote: "움직임은 카메라가 이동하는 것이 아니라, 장면의 정보가 변화하는 것이다.",
      },
      {
        heading: "렌즈와 운동에 이유를 부여한다",
        paragraphs: [
          "푸시인은 발견이나 집중에 적합하고, 풀아웃은 관계와 공간을 드러낸다. 좌우 이동은 새로운 정보를 순차적으로 보여주고, 고정 카메라는 프레임 안의 행동에 힘을 준다.",
          "모든 컷에 큰 움직임을 넣으면 중요한 순간이 사라진다. 정적인 컷과 운동하는 컷의 대비가 있어야 카메라 움직임이 의미를 갖는다.",
        ],
      },
      {
        heading: "마지막에는 소리로 시간을 만든다",
        paragraphs: [
          "영상의 시간감은 화면만으로 완성되지 않는다. 장면이 시작되기 전 들리는 소리, 컷을 넘어 이어지는 잔향, 움직임보다 반 박자 늦게 오는 충격음이 관객의 기대를 만든다.",
          "이미지에서 출발한 작업일수록 사운드가 화면에 없던 공간과 무게를 더한다. 완성 단계에서 음악을 얹는 것이 아니라 콘티 단계부터 소리의 위치를 함께 설계해야 한다.",
        ],
      },
    ],
  },
];

export function getJournalArticle(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
