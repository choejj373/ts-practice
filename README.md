# 모바일 게임을 위한 백엔드 서버 

+ 기능
    + 게임 유저 관리
        + 회원 가입/로그인
            + 커스텀 계정
            + 게스트 계정
            + 구글 계정
            + 네이버, 카카오 계정(todo)
        + 닉네임 변경

    + 소셜 기능
        + 친구
            + 친구 리스트
            + 친구 요청/리스트
            + 친구 수락/거부
            + 친구 삭제
        + 길드(~ing)
        + 우편(todo)

    + 게임 기능
        + 퀘스트
            + 일일 퀘스트
            + 주간 퀘스트
            + 일반 퀘스트
                + 연계 퀘스트
            + 보상
                + 골드, 아이템
            + 타입
                + 로그인, 자원 누적 소모량

        + 상점(~ing)
            + 일일 상점
                + 무료 자원 구입
            + 일반 상점
                + 아이템 구입/판매

        + 인벤토리
            + 아이템 장착/탈착

    + 채팅 서버(todo)
    + 매칭 서버(todo)
    + 멀티 서버(todo)
    + 실시간 알림 서버(todo)

    + 게임 운영 관리(todo)
    + 로그 관리(todo)
    + 결재 관리(todo)
    + 랭킹 관리(todo)
    + 쿠폰 관리(todo)

    + ================================================================================
    + 현재 세부 진행 상황 정리
    

    + 소셜
        + 길드
            + 길드 생성         : post      /guild
            + 길드 삭제         : delete    /guild
            + 길드 정보         : get       /guild
            + 전체 길드 리스트   : get      /guild/all
            + DB
                + guild         
                    + id    : pk
                    + name  : unique index
                    + point

                + user
                    + guild_id 추가

            + 길드원 리스트     : get /guild/member
            + 길드원 추방       : delete  /guild/member
            + 길드원 탈퇴       : delete /guild/member/self
            + 길드원 등급 조정  : put  /guild/member/grade
            + DB
                + guild member  // 길드원
                    + id        : pk auto_increment
                    + guild_id
                    + user_id   
                    + grade
                    + point

            + 길드원 초청           : post /guild/invite
            + 길드원 초청 리스트     : get /guild/invite
            + 길드원 초정 수락       : put /guild/invite/accept
            + 길드원 초정 거절       : put /guild/invite/refuse
            + DB
                + guild_invite  // 초청
                    + guild_id
                    + invite_user_id    // 초대한 유저 id
                    + invited_user_id   // 초대 받은 유저 id

            + 길드 가입 요청        : post /guild/request  
            + 길드 가입 요청 리스트 : get  /guild/request
            + 길드 가입 요청 수락   : put  /guild/request/accept 
            + 길드 가입 요청 거절   : put  /guild/request/refuse 
            + DB
                + guild_request         // 가입 신청
                    + guild_id          // 가입 신청 받은 길드 id
                    + request_user_id   // 가입 신청한 유저 id

    + 상점
            + 일일 상점 구매 제한 방식 수정 필요
                + 현재 일일 상점 구매 제한을 위한 테이블 존재
                + 범용적인 제한 테이블 생성
                + 로그인시 클라이언트에게 해당 정보(제한 시간 포함)를 보내주고 on/off 처리 맡김
                + 제한이 있는 행동에 대한 요청시 제한 테이블 조회 및 업데이트 추가
                
            + 클라이언트 수정/적용 필요
    + ================================================================================
    + 기능상 나중에 한번에 구현할 목록
    + 소셜 : 실시간 알림 서버 구축후
        + 친구
            + 친구 접속 알림
        + 길드
            + 길드원 접속 알림


    + ================================================================================
    + 기능별 상세 사항
