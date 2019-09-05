import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import moment from 'moment';

import fb from '../../../config/firebase';

class Profile extends Component {
    state = {
        user: {
            displayName: null,
            email: '',
            emailVerified: false,
            phoneNumber: null,
            photoURL: null,
            providerId: null,
            uid: null,
        },
        updateUserInfo: {
            displayName: null,
            phoneNumber: null,
            photoURL: null,
        }
    }

    componentDidMount() {
        this.getUserInfo();
    }

    signOut() {
        fb.auth().signOut()
        .then(() => {
            Router.push('/');
        });
    }
    
    getUserInfo = () => {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user);
                const { displayName, email, phoneNumber, photoURL, providerId } = user.providerData[0];
                const params = {
                    uid: user.uid,
                };
                axios.get(`/api/user`, {
                    params, 
                })
                .then(res => {
                    const data = res.data[0];
                    console.log(res);
                    this.setState({
                        user: {
                            account: data.account,
                            displayName,
                            email,
                            emailVerified: user.emailVerified,
                            phoneNumber: data.phone,
                            photoURL,
                            providerId,
                            uid: user.uid,
                            bod: data.bod,
                            gender: data.gender,
                            height: data.height,
                            weight: data.weight,
                            iduser: data.iduser,
                            introduction: data.introduction,
                            name: data.name
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        phoneValidating: false, // 인증 전
                    });
                });
            } else {
                console.log('user가 없습니다.');
                Router.push('/sign-in');
            }
        });
    }

    render() {
        const { account, name, bod, gender, height, weight, introduction, displayName, email, emailVerified, phoneNumber, photoURL, providerId } = this.state.user;

        return (
            <div className="profile-container">
                <header className="profile-title">
                    {
                        displayName
                        ? `${displayName}님 반갑습니다!`
                        : '반갑습니다!'
                    }
                </header>
                <main>
                    <div className="profile-section-container">
                        <p className="profile-section-title">프로필</p>
                        <section className="profile-section">
                            <div className="profile-section-contents">
                                <div className="profile-content-definition">
                                   <p className="definition-word">이름</p>
                                   <p>{name}</p>
                                </div>
                                <div className="profile-content-definition-container">
                                    <div className="profile-content-definition">
                                       <p className="definition-word">이메일</p>
                                       <p>{emailVerified ? email : `${email}`}</p>
                                    </div>
                                </div>
                                <div className="profile-content-definition">
                                    <p className="definition-word">연락처</p>
                                    <p>{phoneNumber && phoneNumber.replace(/ /gi, "").replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1  $2  $3")}</p>
                                </div>
                                <div className="profile-content-definition">
                                    <p className="definition-word">생일</p>
                                    <p>{bod ? `${moment.parseZone(bod).local().format('YYYY년 MM월 DD일')}` : '-'}</p>
                                </div>
                                <div className="profile-content-definition">
                                    <p className="definition-word">성별</p>
                                    <p>{gender ? gender : '-'}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="profile-section-container">
                        <p className="profile-section-title">환급</p>
                        <section className="profile-section">
                            <div className="profile-section-contents">
                                <div className="profile-content-definition-container">
                                    <div className="profile-content-definition">
                                        <p className="definition-word">계좌번호</p>
                                        <p>{account !== null ? account : '-'}</p>
                                    </div>
                                    <p className="definition-word-desc">
                                        * 호스트 환급 목적 이외 사용되지 않으며 제 3자에게 공개되지 않습니다.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="profile-section-container section_btn">
                        <section className="profile-section">
                            <Link href='profile/edit'><a>프로필 수정</a></Link>
                        </section>
                    </div>
                    <div className="profile-section-container section_btn">
                        <section className="profile-section">
                            <Link href='profile/account'><a>계좌 관리</a></Link>
                        </section>
                    </div>
                    <div className="profile-section-container section_btn">
                        <section className="profile-section">
                            <Link href='settings'><a>계정 관리</a></Link>
                        </section>
                    </div>
                    <div className="profile-section-container section_btn">
                        <section className="profile-section">
                            <Link
                            href='/'
                            >
                                <a
                                    onClick={this.signOut}
                                >로그아웃</a>
                            </Link>
                        </section>
                    </div>

                </main>
            </div>
        );
    }
}

export default Profile;
