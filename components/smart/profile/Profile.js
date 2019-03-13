import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';

import fb from '../../../config/firebase';

import MainView from '../../layout/MainView';

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
                axios.get('http://localhost:3333/api/auth/user', {
                    params,
                })
                .then(res => {
                    const data = res.data[0];
                    console.log(res);
                    this.setState({
                        user: {
                            displayName,
                            email,
                            emailVerified: user.emailVerified,
                            phoneNumber: data.phone,
                            photoURL,
                            providerId,
                            uid: user.uid,
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
        const { displayName, email, emailVerified, phoneNumber, photoURL, providerId } = this.state.user;

        return (
            <MainView>
                    <h1>
                    {
                        displayName
                        ? `${displayName}님 반갑습니다!`
                        : '반갑습니다!'
                    }
                    </h1>
                    <div>
                    <h3>기본 정보</h3>
                    <p>{!photoURL && '사진 없음'}</p>
                    <p>{!displayName && '이름을 설정해주세요.'}</p>
                    <p>{emailVerified ? email : `${email} 인증 필요`}</p>
                    <p>{phoneNumber && phoneNumber}</p>
                </div>
                <div>
                    <Link href='settings'><a>설정</a></Link>
                </div>
                <Link
                    href='/'
                >
                    <a
                        onClick={this.signOut}
                    >로그아웃</a>
                </Link>
            </MainView>
        );
    }
}

export default Profile;
