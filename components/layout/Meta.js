import Head from 'next/head';

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous"></link>
    </Head>
    <style jsx global>{`
         body {
            margin: 0px;
            height: 100%;
        }

        html {
            font-family: 'Nanum Gothic', sans-serif;
            font-size: 16px;
            color: #212121;
        }

        /* HTML5 display-role reset for older browsers */
        article, aside, details, figcaption, figure, 
        footer, header, hgroup, menu, nav, section {
            display: block;
        }
        p {
            letter-spacing: 1px;
        }
        ol, ul {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            list-style: none;
        }
        blockquote, q {
            quotes: none;
        }
        blockquote:before, blockquote:after,
        q:before, q:after {
            content: '';
            content: none;
        }

        a {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            color: #757575;
        }

        a:link {
            text-decoration: none;
        }
        
        a:visited {
            color: #757575;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: none;
        }
        
        a:active {
            text-decoration: none;
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        textarea:disabled, input:disabled {
            background-color: rgb(235, 235, 228);
        }

        button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            -webkit-transition: all 200ms cubic-bezier(0.390, 0.500, 0.150, 1.360);
            -moz-transition: all 200ms cubic-bezier(0.390, 0.500, 0.150, 1.360);
            -ms-transition: all 200ms cubic-bezier(0.390, 0.500, 0.150, 1.360);
            -o-transition: all 200ms cubic-bezier(0.390, 0.500, 0.150, 1.360);
            transition: all 200ms cubic-bezier(0.390, 0.500, 0.150, 1.360);
            display: block;
            text-decoration: none;
            border-radius: 4px;
            outline: none;
            font-size: .8rem;
            cursor: pointer;
        }
        button:disabled {
            color: #bdbdbd;
            cursor: not-allowed;
        }
        .mask {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 10;
            left: 0;
            top: 0;
            background-color: #000;
            display: none;
        }
        .mask.toggle {
            display: block;
            opacity: 0;
            transition: .5s ease-out;
        }
        @media screen and (max-width: 414px) {
            html {
                font-size: 14px;
            }
        }
        @media screen and (min-width: 1201px) {
            .mask.toggle {
                display: none !important;
            }
        }

        table {
            width: 100%;
        }

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
        tr:nth-child(even){background-color: #f5f5f5;}
        
        tr:hover {background-color: #e3f2fd;}
        
        th {
            min-width: 16px;
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: center;
            background-color: #2196f3;
            color: white;
        }
        tbody > p {
            color: #757575;
        }

        input[type=submit] {
            cursor: pointer;
        }
    `}</style>
  </div>
)