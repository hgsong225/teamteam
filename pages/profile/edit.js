//추후 Container로 작업 할 것
import React, { Component } from 'react';

import fb from '../../config/firebase';
import Header from '../../components/smart/layout/Header';

class Settings extends Component {
    completeEdit = React.createRef()

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

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextState);
        
        return true;
    }
    
    signOut() {
        fb.auth().signOut();
        Router.push('/');
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

    deleteUser = () => {
        fb.auth().currentUser()
        .delete()
        .then(res => console.log('계정 삭제 완료', res))
        .catch(err => console.log('계정 삭제 실패', err));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { updateUserInfo } = this.state;
        const { displayName, email, emailVerified, phoneNumber, photoURL, providerId, uid } = this.state.user;
        const user = {
            displayName: e.target[0].value,
            email,
            emailVerified,
            phoneNumber,
            photoURL,
            providerId,
            uid,
        };

        fb.auth().currentUser.updateProfile(updateUserInfo)
        .then(res => {
            this.setState({
                user,
                updateUserInfo: {
                    displayName: null,
                    phoneNumber: null,
                    photoURL: null,
                }
            });

            console.log('프로필 업데이트 성공', res);
        })
        .catch(err => console.log('프로필 업데이트 실패', err));

        this.completeEdit.current.reset();

    }

    handleChange = (e) => {
        let updateUserInfo = {...this.state.updateUserInfo};
        updateUserInfo[e.target.name] = e.target.value;

        this.setState({
            updateUserInfo,
        });
    }

    render() {
        return (
            <div>
                <Header />
                <header>teamteam Settings</header>
                <main>
                    <form
                        onSubmit={this.handleSubmit}
                        ref={this.completeEdit}
                    >
                        <label>
                            닉네임
                        </label>
                        <input
                            id="editNickname"
                            onChange={this.handleChange}
                            placeholder={this.state.user.displayName ? `${this.state.user.displayName}` : '닉네임을 입력해주세요. (8자)'}
                            type="text"
                            name="displayName"
                            maxLength="16"
                        />
                        <div>
                            <button>완료</button>
                        </div>
                    </form>
                    <button
                        onClick={this.deleteUser}
                    >
                        계정 지우기
                    </button>
                </main>
            </div>
    
        );
    }
}

export default Settings;
