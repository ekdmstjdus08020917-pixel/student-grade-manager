# 학생 성적 관리 시스템

학생 정보를 등록하고 과목별 점수를 입력해 평균과 등급을 자동 계산하는 CRUD 기반 웹 애플리케이션

## 기술 스택
- Frontend: HTML / JavaScript
- Backend: Node.js (Express)
- Database: MySQL
- Infrastructure: Docker Compose

## 컨테이너 구성
- app: frontend + backend 통합
- db: MySQL 단독 (볼륨 마운트)

## 실행 방법

1. 레포지토리 클론
git clone https://github.com/ekdmstjdus08020917-pixel/student-grade-manager.git

2. .env 파일 생성 (.env.example 참고)

3. 컨테이너 실행
docker compose up --build -d

4. 브라우저에서 접속
http://localhost:3000

## API 목록
- POST /students : 학생 등록
- GET /students : 전체 학생 조회
- GET /students/:id : 특정 학생 조회
- PUT /students/:id : 학생 수정
- DELETE /students/:id : 학생 삭제
- POST /scores : 점수 입력
- PUT /scores/:id : 점수 수정
- DELETE /scores/:id : 점수 삭제

## 등급 기준
- A: 90점 이상
- B: 80 ~ 89
- C: 70 ~ 79
- D: 60 ~ 69
- F: 59 이하
