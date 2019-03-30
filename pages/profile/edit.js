//추후 Container로 작업 할 것
import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';

import fb from '../../config/firebase';
import MainView from '../../components/layout/MainView';

import '../../style/profile-edit.css';

class Settings extends Component {
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

    handleSubmit = (e) => {
        e.preventDefault();
 
        const { user } = this.state;
        const updateUser = {
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
            axios.put('http://localhost:3333/api/auth/user', {
                data: user,
            })
            .then((res) => {
                alert('프로필 수정 완료');
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
        let user = {...this.state.user};
        user[e.target.name] = e.target.value;

        this.setState({
            user,
        });
    }

    render() {
        const { user } = this.state;
        return (
            <MainView>
            <div className="profile-edit-container">
                <p className="profile-edit-title">프로필 수정</p>
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
                                        이름
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.name}
                                        type="text"
                                        name="name"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        닉네임
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.displayName}
                                        type="text"
                                        name="displayName"
                                        maxLength="16"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        이메일
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.email}
                                        type="email"
                                        name="email"
                                        disabled={true}
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        연락처
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.phoneNumber}
                                        type="number"
                                        name="phoneNumber"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        생일
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.bod}
                                        type="date"
                                        name="bod"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        성별
                                    </div>
                                    <select
                                        onChange={this.handleChange}
                                        placeholder={user.gender}
                                        type="text"
                                        name="gender"
                                    >
                                     <option value='null'>
                                            선택안함
                                        </option>
                                        <option
                                            value='m'
                                            selected={user.gender === '남자' && true}
                                        >
                                            남자
                                        </option>
                                        <option
                                            value='w'
                                            selected={user.gender === '여자' && true}
                                        >
                                            여자
                                        </option>
                                    </select>
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        키
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.height}
                                        type="number"
                                        name="height"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                    <div className="definition-word">
                                        몸무게
                                    </div>
                                    <input
                                        onChange={this.handleChange}
                                        placeholder={user.weight}
                                        type="number"
                                        name="weight"
                                    />
                                </section>
                                <section className="profile-edit-form-section">
                                </section>
                            </form>
                        </section>
                        <footer className="profile-edit-section button-section">
                            <button>
                                <Link href='/profile'><a>취소</a></Link>
                            </button>
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

export default Settings;
