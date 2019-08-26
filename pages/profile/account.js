//추후 Container로 작업 할 것
import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';

import fb from '../../config/firebase';
import MainView from '../../components/layout/MainView';

class EditAccount extends Component {
    completeEdit = React.createRef()

    state = {
        user: null,
    }

    componentDidMount() {
        this.getUserInfo();
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
                            bod: data.bod === null ? null : moment.parseZone(data.bod).local().format('YYYY-MM-DD'),
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

    handleSubmit = (e) => {
        e.preventDefault();
 
        const { user } = this.state;
        const updateUser = {
            account: user.account,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
        };

        fb.auth().currentUser.updateProfile(updateUser)
        .then(res => {
            axios.put(`/api/user`, {
                data: user,
            })
            .then((res) => {
                alert('수정했습니다.');
                Router.push('/profile');
            })
            .catch((error) => {
                console.log(error);
                e.preventDefault();
                this.setState({
                    phoneValidating: false, // 인증 전
                });
            });
            console.log('fb 프로필 업데이트 성공', res);
        })
        .catch(err => console.log('프로필 업데이트 실패', err));

        this.completeEdit.current.reset();

    }

    handleChange = (e) => {
        let user = { ...this.state.user };
        user[e.target.name] = e.target.value;

        if (e.target.name === 'displayName') {
            user[e.target.name] = e.target.value.replace(/ /gi, ""); ;
        }
        this.setState({
            user,
        });
    }

    render() {
        const { user } = this.state;
        return (
            <MainView>
            <Head>
                <title>팀팀 | 계좌 관리</title>
                <link href="../../static/profile-edit.css" rel="stylesheet" />
            </Head>
            <div className="profile-edit-container">
                <p className="profile-edit-title">계좌 관리</p>
                {
                    user !== null &&
                    <main>
                        <section className="profile-edit-section">
                            <form
                                className="profile-edit-form-container"
                                ref={this.completeEdit}
                            >
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        계좌번호
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.account}
                                        type="text"
                                        name="account"
                                    />
                                </section>
                            </form>
                        </section>
                        <footer className="profile-edit-section button-section">
                            <Link href='/profile'>
                                <button
                                    className="profile-edit-cancel button"
                                >취소
                                </button>
                            </Link>
                            <button
                                onClick={this.handleSubmit}
                                type="submit"
                            >완료</button>
                        </footer>
                    </main>
                }
            </div>
            </MainView>
        );
    }
}

export default EditAccount;
