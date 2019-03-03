import React, { Component } from 'react';

import Header from '../common/Header';
import Container from '../../dumb/common/Container';

class Membership extends Component {
    render() {
        return (
            <div>
                <Header />
                <Container>
                    <header>팀팀 멤버십</header>
                    <main>
                        <p><strong>월 1,000원</strong>으로 팀팀의 모든 축구, 풋살 경기를 즐길 수 있습니다!</p>
                        <p>첫 달 무료!</p>
                        <table>
                            <tr>
                                <th></th>
                                <th>
                                    Basic
                                    <p>무료</p>
                                </th>
                                <th>
                                    Standard
                                    <p>1,000원 / 12개월 (약 48% 할인)</p>
                                    <p>1,900원 / 1개월</p>
                                </th>
                            </tr>
                            <tr>
                                <th>경기 보기 (오늘)</th>
                                <td>o</td>
                                <td>o</td>
                            </tr>
                            <tr>
                                <th>경기 생성 (오늘 제외)</th>
                                <td>o</td>
                                <td>o</td>
                            </tr>
                            <tr>
                                <th>모든 날짜 경기 보기</th>
                                <td>-</td>
                                <td>o</td>
                            </tr>
                            <tr>
                                <th>모든 날짜 경기 생성</th>
                                <td>-</td>
                                <td>o</td>
                            </tr>
                        </table>
                        <button>멤버십 가입하기</button>
                    </main>
                </Container>
            </div>
        );
    }
}

export default Membership;
