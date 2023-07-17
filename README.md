+ 기능
    + 게임 유저 관리
        + 회원 가입/로그인
            + 커스텀 계정
            + 게스트 계정
            + 구글 계정
            + 네이버, 카카오 계정(todo)
        + 닉네임 변경

    + 소셜 기능(~ing)
        + 친구 기능(~ing)
        + 길드 기능(todo)
        + 우편 기능(todo)
        + 쪽지 기능(todo)

    + 채팅 서버(todo)
    + 매칭 서버(todo)
    + 멀티 서버(todo)
    + 게임 운영 관리(todo)
    + 로그 관리(todo)
    + 결졔 관리(todo)
    + 랭킹 관리(todo)
    + 쿠폰 관리(todo)

    + 인벤토리 관리(todo)
    + 캐릭터 정보 관리(todo)
    + 퀘스트 정보 관리(todo)

    + ================================================================================
    + 세부 진행 상황 정리
    + 소셜 기능
        + 친구 기능
            + 전체 친구 리스트 : get /friend
            + 친구 삭제 : delete /friend/:name

            + 친구 요청 리스트 얻기   : get /friend/request
            + 친구 요청              : post /friend/request
            + 친구 요청 수락         : put /friend/request/accept
                + 요청 유저와 요청 받은 유저 둘다 등록됨

            + 친구 요청 거절        : put /friend/request/refuse

            + 친구 접속 알림
                + redis pub/sub : ?
            + db
                + user_friend
                    + friend_user_id 
                    + owner non unique index( user_id )

                + friend_request_list;
                    + requested_user_id : 요청 받은 유저 - non unique index
                    + request_user_id : request를 한 유저
