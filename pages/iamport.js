import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

import fb from '../config/firebase';

import Layout from '../components/layout/Layout';
import Posts from '../components/smart/post/Posts';


class IAM extends Component {

    componentDidMount() {
        const IMP = window.IMP; // 생략가능
        IMP.init('imp22498141'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
    }
    
    test = (e) => {
        e.preventDefault();

        console.log('헤이맨');
    }

    iamport() {
        IMP.request_pay({
            pg : 'inicis', // version 1.1.0부터 지원.
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : '주문명:결제테스트',
            amount : 14000,
            buyer_email : 'iamport@siot.do',
            buyer_name : '구매자이름',
            buyer_tel : '010-1234-5678',
            buyer_addr : '서울특별시 강남구 삼성동',
            buyer_postcode : '123-456',
            m_redirect_url : 'https://localhost:3000/iamport'
        }, (rsp) => {
            if ( rsp.success ) {
                var msg = '결제가 완료되었습니다.';
                msg += '고유ID : ' + rsp.imp_uid;
                msg += '상점 거래ID : ' + rsp.merchant_uid;
                msg += '결제 금액 : ' + rsp.paid_amount;
                msg += '카드 승인번호 : ' + rsp.apply_num;
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
            }
            alert(msg);
        });
    }

    render() {
        return (
            <div>
                <style jsx>{`
                    button {
                        width: 500px;
                        height: 500px;
                        cursor: pointer;
                        z-index: 909;
                        position: relative;
                    }
                `}</style>
                <Head>
                    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
                    <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"></script>
                </Head>
                <button
                    onClick={this.iamport}
                >헤이맨</button>
            </div>
        );
    }
}

export default IAM;
