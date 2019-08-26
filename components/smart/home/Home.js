import React, { Component } from 'react';
import Head from 'next/head';

class Home extends Component {
    render() {
        return (
            <div>
                <Head>
                    <title>팀팀 | 내 주변 축구 경기에 지금 당장 참여하세요. | 간편하게 축구 경기를 생성하고 편하게 사람을 모으세요.</title>
                    <link href="../static/sign-in.css" rel="stylesheet" />
                </Head>
                teamteam에 오신 걸 환영합니다.
            </div>
        );
    }
}

export default Home;