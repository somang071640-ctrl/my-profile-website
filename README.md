# 서하린 · 패션 디자이너 프로필 웹사이트

실습용 **가상 인물** 서하린(SOOM Atelier 대표 디자이너)의 개인 프로필 웹사이트입니다.
HTML·CSS·JavaScript만 사용한 정적 사이트이며, React·Next.js·Express는 사용하지 않습니다.

- 배포 주소: https://my-profile-website-one.vercel.app

## 구성

| 영역 | 내용 |
| --- | --- |
| Home | 소개(왼쪽) · 프로필 사진(오른쪽) · 숫자 요약 |
| About | 전공 · 경력 타임라인 · 관심 분야와 도구 |
| Projects | SOOM Atelier · Mend Day · LINE 7 (카드를 누르면 상세 페이지) |
| Contact | 이메일(클릭 시 메일 작성 · 복사 버튼) · 소셜 링크 · 메일 앱으로 보내는 문의 양식 |

## 폴더 구조

```
my-profile/
├── public/                 ← 배포되는 정적 파일 (Vercel Output Directory)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── 404.html
│   ├── images/             ← 프로필 사진 · 파비콘 · 프로젝트 썸네일
│   └── projects/<이름>/index.html
├── server.js               ← 로컬 테스트용 Node.js 서버 (외부 패키지 없음)
├── package.json
└── vercel.json
```

## 로컬에서 실행

```bash
npm start
# → http://localhost:3000
```

## 배포 (Vercel)

- Framework Preset: **Other**
- Build Command: 비움
- Output Directory: **public**

`vercel.json`에 같은 설정이 들어 있어 GitHub 저장소를 연결하면 Push할 때마다 자동으로 다시 배포됩니다.
