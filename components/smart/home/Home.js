import React, { Component } from 'react';
import Head from 'next/head';

class Home extends Component {
    render() {
        return (
            <div>
                <Head>
                    <title>팀팀 | 내 주변 축구 경기 참여하기 | 간편하게 축구 할 사람 모으기</title>
                    <link href="../static/sign-in.css" rel="stylesheet" />
                </Head>
                teamteam에 오신 걸 환영합니다.
            </div>
        );
    }
}

export default Home;