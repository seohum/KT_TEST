
JSON 단일 정책 구조 (Action/Excel 미사용)

- 정책은 data/wired/policy.json 만 수정
- KEY 규칙:
  WIRED|상품구분|TV/NO_TV|옵션

옵션 규칙:
- TV 없는 상품: GENIE3 선택 불가
- TV 있는 상품: GENIE3 선택 가능
- 원스톱 / 기가지니3 조합별 KEY 분기

JS는 JSON을 그대로 조회하여 가격 반영
