import React, { Component } from 'react';
import Router from 'next/router';
import axios from 'axios';

import fb from '../config/firebase';

import MainView from '../components/layout/MainView';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        checkPassword: false,
        phone: '',
        phoneValidating: false, // true, false, processing
        userCertificationNumber: '',
        certificationNumber: '',
        isSameCertificationNumber: false, // true, false, difference
        effectiveTime: 180,
        errors: {},
    }
 
    componentWillUnmount () {
        clearInterval(this.intervalId);
    }

    timer = () => {
        if (this.state.effectiveTime > 0) {
            this.setState({
                effectiveTime: this.state.effectiveTime - 1,
            })
        } else {
            clearInterval(this.intervalId);
            this.setState({
                effectiveTime: 300,
                phoneValidating: false,
                certificationNumber: '',
            })
        }
    }

    componentWillUnmount () {
        if (this.state.effectiveTime == 0) {
            clearInterval(this.myInterval);
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });

        // if ((this.state.password !== '' && this.state.password2 !== '') && (this.state.password == this.state.password2)) {
        //     this.setState({
        //         checkPassword: true,
        //     })
        // }
    }

    validatePhoneNumber = () => {
        if (this.state.phone.length > 0) {
            this.intervalId = setInterval(this.timer, 1000);
            this.setState({
                phoneValidating: 'processing', // 인증 중
                effectiveTime: 180,
            });
            const { phone } = this.state;
            const data = {
                phoneNumber: phone,
            };
            console.log(phone);
    
            axios.post('http://localhost:3333/api/auth/smsVerification', {
                data,
            })
            .then((res) => {
                console.log(res.data);
                this.setState({
                    certificationNumber: res.data.certificationNumber,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    phoneValidating: false, // 인증 전
                    errors: {
                        phone: '',
                    }
                });
            });
        } else {
            this.setState({
                errors: {
                    phone: "전화번호를 입력하고 인증을 완료하세요.",
                }
            });
        }
    }

    compareCertificationNumber = () => {
        const { userCertificationNumber, certificationNumber } = this.state;
        if (userCertificationNumber == certificationNumber) {
            clearInterval(this.intervalId);            
            return this.setState({
                isSameCertificationNumber: true,
                phoneValidating: true,
                errors: {
                    phone: '',
                }
            });
        } else if (userCertificationNumber !== certificationNumber) {
            return this.setState({
                isSameCertificationNumber: 'difference',
            })
        }
    }

    handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        const {
            name,
            email,
            password,
            password2,
            checkPassword,
            phone,
            phoneValidating, // true, false, processing
            userCertificationNumber,
            certificationNumber,
            isSameCertificationNumber, // true, false, difference
            effectiveTime,
        } = this.state;

        if (!name.length > 0) {
            formIsValid = false;
            errors["name"] = "이름을 기입하세요.";
        }
        if (!email.length > 0) {
            formIsValid = false;
            errors["email"] = "이메일을 입력하세요.";
        }
        if (password.length < 5 || password2.length < 5 || (!password.length > 0 && !password2.length > 0)) {
            formIsValid = false;
            errors["password"] = "비밀번호를 입력하세요. 6자 이상";
        }
        if (password !== password2) {
            formIsValid = false;
            errors["password"] = "비밀번호가 다릅니다.";
        }
        if (!phone.length > 0  || (!phone.length > 0 && phoneValidating !== true) || phoneValidating !== true) {
            formIsValid = false;
            errors["phone"] = "전화번호를 입력하고 인증을 완료하세요.";
        }
        
        this.setState({ errors, });

        return formIsValid;
    }

    signUp = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                console.log('회원가입에 성공했습니다.', user);
                const { email } = user.user.providerData[0];
                const firstDisplayName = email.split('@')[0];
    
                // promise all로 순서 관리.
                fb.auth().currentUser.updateProfile({
                    displayName: firstDisplayName,
                }).then(res => {
                    const data = {
                        fb_uid: user.uid,
                        name: this.state.name,
                        email,
                        phone: this.state.phone,
                        display_name: firstDisplayName,
                    };
                    axios.post('http://localhost:3333/api/auth/user', {
                        data,
                    })
                    .then((res) => {
                        Router.push('/');
                    })
                    .catch((error) => {
                        console.log(error);
                        this.setState({
                            phoneValidating: false, // 인증 전
                        });
                    });
                });
                // const insertUserDataTomySQL = () => {
    
                // }
            })
            .catch(err => {
                console.log(err);
            });   
        }
    }

    render() {
        return (
                <MainView>
                <style jsx>{`
                    .error-msg {
                        font-size: 0.8rem;
                        color: #f44336;
                    }
                    .sign-container {
                        margin-left: 16px;
                        margin-right: 16px;
                        max-width: 550px;
                    }
                    form {
                    }
                    .page-title-box {
                        margin-top: 3rem;
                        margin-bottom: 3rem;
                    }
                    .page-title {
                        font-size: 2rem;
                    }
                    .page-desc {
                        line-height: 1.6;
                        font-size: 1rem;
                    }
                    input {
                        box-sizing: border-box;
                        margin-bottom: 0.5rem;
                        padding: 10px;
                        border: 1px solid #e0e0e0;
                        width: 100%;
                        border-radius: 4px;
                        height: 50px;
                        font-size: 1rem;
                        color: #212121;
                    }
                    .section {
                        margin-bottom: 2rem;
                    }
                    .section-contents {
                        margin-bottom: 2rem;
                    }
                    .contents-title {
                        font-size: 1rem;
                        color: #9e9e9e;
                    }
                    .contents-desc {
                        font-size: 0.8rem;
                        color: #757575;
                    }
                    .validate-phone {
                        color: #2196f3;
                        cursor: pointer;
                        border: none;
                        background-color: #fff;
                    }
                    .validating-phone, .validated-phone {
                        margin-top: 0;
                    }
                    .validating-phone, .different-certification-number {
                        color: #f44336;
                    }
                    .validated-phone {
                        color: #212121;
                    }
                    .button-box {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                    }
                    input[type=submit] {
                        width: 160px;
                        background-color: #2196f3;
                        color: #fff;
                        cursor: pointer;
                        outline: none;
                    }
                    input[type=submit]:hover {
                        box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                    }
                `}</style>
                <div className="sign-container">
                    <div className="page-title-box">
                        <p className="page-title">teamteam에 오신 것을 환영합니다!</p>
                        <p className="page-desc"><strong>축구를 하고 싶은 사람들</strong>이 기다리고 있습니다.<br />지금 당장 <strong>경기를 만들거나 참여</strong>하세요!</p>
                    </div>
                    <form 
                        onSubmit={this.signUp}
                    >
                        <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">
                                        이름
                                        {
                                            this.state.errors.name && <span className="error-msg"> - {this.state.errors.name}</span>
                                        }
                                    </p>
                                    <input
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        name="name"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">
                                        이메일
                                        {
                                            this.state.errors.email &&
                                            <span className="error-msg"> - {this.state.errors.email}</span>
                                        }
                                    </p>
                                    <input
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        name="email"
                                        type="email"
                                    />
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">
                                        비밀번호
                                        {
                                            this.state.errors.password &&
                                            <span className="error-msg"> - {this.state.errors.password}</span>
                                        }
                                    </p>
                                    <input
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        name="password"
                                        type="password"
                                    />
                                    <p className="contents-desc">한 번 더 입력해주세요.</p>
                                    <input
                                        value={this.state.password2}
                                        onChange={this.handleChange}
                                        name="password2"
                                        type="password"
                                    />
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">
                                        휴대폰 번호
                                        {
                                            this.state.errors.phone &&
                                            <span className="error-msg"> - {this.state.errors.phone}</span>
                                        }
                                    </p>
                                    <input
                                        className="phone-input"
                                        placeholder="'-'를 제외하고 입력해주세요."
                                        value={this.state.phone}
                                        onChange={this.handleChange}
                                        name="phone"
                                        type="number"
                                        disabled={this.state.phoneValidating === true ? true : false}
                                    />
                                    {
                                        (this.state.phoneValidating == false || this.state.effectiveTime == 0 ) &&
                                        <button
                                            className="validate-phone"
                                            onClick={this.validatePhoneNumber}
                                        >
                                            인증 요청
                                        </button>
                                    }
                                    {
                                        this.state.phoneValidating == "processing" &&
                                        <div>
                                            <p
                                                className="validating-phone"
                                                onClick={this.validatePhoneNumber}
                                            >
                                                재발송 - {`${parseInt((this.state.effectiveTime % 3600) / 60)}분 ${this.state.effectiveTime % 60}초`}
                                            </p>
                                            <input
                                                placeholder="인증번호 6자리 입력"
                                                value={this.state.userCertificationNumber}
                                                onChange={this.handleChange}
                                                name="userCertificationNumber"
                                            />
                                            {
                                                this.state.isSameCertificationNumber == "difference" &&
                                                <div>
                                                    <p className="different-certification-number">
                                                        인증번호가 다릅니다.
                                                    </p>
                                                    <button
                                                        onClick={this.compareCertificationNumber}
                                                        className="validate-phone"
                                                    >
                                                        확인
                                                    </button>
                                                </div>
                                            }
                                            {
                                                this.state.isSameCertificationNumber == false &&
                                                <button
                                                    onClick={this.compareCertificationNumber}
                                                    className="validate-phone"
                                                >
                                                    확인
                                                </button>
                                            }
                                        </div>
                                    }
                                    {
                                        this.state.phoneValidating == true && <p className="validated-phone">인증 완료</p>
                                    }
                                </div>
                            </div>
                            <div className="button-box">
                                <input
                                    type="submit"
                                    value="완료"
                                />
                            </div>
                    </form>
                </div>
            </ MainView>
        );
    }
}

export default SignUp;