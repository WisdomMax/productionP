# Production P 문의 메일 설정

홈페이지 문의 폼은 Cloudflare Pages Function이 Resend를 통해 메일을
발송하도록 구현되어 있습니다. 아래 설정 전에는 폼이
`메일 발송 설정이 아직 연결되지 않았습니다.`라고 응답합니다.

## 1. contact@productionp.com 수신함 연결

`contact@productionp.com` 주소가 실제로 메일을 받을 수 있어야 합니다.
별도 유료 메일 계정이 없다면 Cloudflare Email Routing으로 기존 Gmail에
전달할 수 있습니다.

1. Cloudflare에서 `productionp.com` 도메인을 선택합니다.
2. **Email → Email Routing → Get started**로 이동합니다.
3. Destination address에 실제 확인 가능한 Gmail 주소를 등록하고 인증합니다.
4. Custom address를 아래처럼 만듭니다.
   - Custom address: `contact`
   - Destination: 위에서 인증한 Gmail
5. 테스트 메일을 `contact@productionp.com`으로 보내 실제 도착을 확인합니다.

Cloudflare에 `productionp.com` 도메인이 아직 연결되지 않았다면 먼저 도메인의
네임서버를 Cloudflare로 연결해야 합니다.

## 2. Resend 발신 도메인 인증

1. [Resend](https://resend.com)에 가입합니다.
2. **Domains → Add Domain**에서 `productionp.com`을 추가합니다.
3. Resend가 안내하는 DNS 레코드를 Cloudflare DNS에 등록합니다.
4. Resend에서 상태가 **Verified**가 될 때까지 기다립니다.
5. **API Keys → Create API Key**에서 Sending access 키를 생성합니다.

API 키는 생성 직후 한 번만 보일 수 있으므로 안전한 곳에 보관합니다.
저장소의 `.env`나 GitHub에 키를 커밋하지 마세요.

## 3. Cloudflare Pages 환경 변수 등록

Cloudflare Dashboard에서 다음 위치로 이동합니다.

**Workers & Pages → productionp → Settings → Variables and Secrets**

Production 환경에 아래 세 값을 등록합니다.

| 이름 | 값 | 종류 |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend에서 생성한 `re_...` 키 | Secret |
| `CONTACT_TO_EMAIL` | `contact@productionp.com` | Text |
| `CONTACT_FROM_EMAIL` | `Production P Website <website@productionp.com>` | Text |

Preview 배포에서도 폼을 시험하려면 같은 값을 Preview 환경에도 등록합니다.

## 4. 재배포 및 시험

1. 환경 변수 저장 후 **Deployments**에서 최신 배포를 **Retry deployment**하거나
   `main` 브랜치에 새 커밋을 푸시합니다.
2. `https://productionp.pages.dev`의 **영상 제작 의뢰하기**를 엽니다.
3. 회신 가능한 이메일, 4자 이상의 제목, 20자 이상의 내용을 입력해 발송합니다.
4. `contact@productionp.com`에 연결된 Gmail에서 수신을 확인합니다.
5. 메일의 Reply-To는 방문자가 입력한 이메일로 설정되므로 받은 메일에서 바로
   답장할 수 있습니다.

## 문제 확인

- `메일 발송 설정이 아직 연결되지 않았습니다.`  
  `RESEND_API_KEY`가 Production 환경에 없거나 재배포 전입니다.
- 발송 중 문제가 발생했다는 메시지  
  Resend 도메인 인증, API 키 권한, `CONTACT_FROM_EMAIL`을 확인합니다.
- 발송 성공인데 받은 편지함에 없음  
  Cloudflare Email Routing의 destination 인증과 스팸함을 확인합니다.
