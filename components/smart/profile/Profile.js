import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
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
                
                this.setState({
                    user: {
                        displayName,
                        email,
                        emailVerified: user.emailVerified,
                        phoneNumber,
                        photoURL,
                        providerId,
                        uid: user.uid,
                    }
                });
            } else {
                console.log('user가 없습니다.');
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
                    <p>{!phoneNumber && '현재 등록된 전화번호가 없습니다.'}</p>
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
