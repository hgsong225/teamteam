import React, { Component } from 'react';
import Router from 'next/router';
import fb from '../config/firebase';

import Header from '../components/smart/layout/Header';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        phone: '',
        checkPassword: false,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });

        if ((this.state.password !== '' && this.state.password2 !== '') && (this.state.password == this.state.password2)) {
            this.setState({
                checkPassword: true,
            })
        }
    }

    signUp = (e) => {
        e.preventDefault();

        fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            console.log('회원가입에 성공했습니다.', user);
            const { email } = user.user.providerData[0];
            const firstDisplayName = email.split('@')[0];

            fb.auth().currentUser.updateProfile({
                displayName: firstDisplayName,
            }).then(res => {
                Router.push('/');
            });
            this.setState({
                name: '',
                email: '',
                passwsord: '',
                passwsord2: '',
                phone: '',
                checkPassword: false,
            })
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <Header />
                <header>teamteam에 오신 것을 환영합니다!</header>
                <form 
                    onSubmit={this.signUp}
                >
                    <label>이름</label>
                    <br />
                    <input
                        value={this.state.name}
                        onChange={this.handleChange}
                        name="name"
                        type="text"
                    />
                    <br />
                    <label>이메일</label>
                    <br />
                    <input
                        value={this.state.email}
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                    />
                    <br />
                    <label>비밀번호</label>
                    <br />
                    <input
                        value={this.state.password}
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                    />
                    <br />
                    <label>다시 한 번</label>
                    <br />
                    <input
                        value={this.state.password2}
                        onChange={this.handleChange}
                        name="password2"
                        type="password"
                    />
                    <br />
                    <label>휴대폰 번호</label>
                    <br />
                    <input
                        placeholder="'-'를 제외하고 입력해주세요."
                        value={this.state.phone}
                        onChange={this.handleChange}
                        name="phone"
                        type="number"
                    />
                    <br />
                <button type="submit">완료</button>
            </form>
            </div>
        );
    }
}

export default SignUp;