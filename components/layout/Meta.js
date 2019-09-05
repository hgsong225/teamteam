import Head from 'next/head';

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="minimum-scale=1, width=device-width, initial-scale=1, shrink-to-fit=no" />
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
        ol, ul, li {
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
            display: inline-block;
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

        a:visited.button {
            color: white;
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        textarea:disabled, input:disabled {
            background-color: rgb(235, 235, 228);
        }

        button, a.button, a:visited.button {
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
            font-size: 1rem;
            cursor: pointer;
            background-color: #1e88e5;
            box-sizing:border-box;

        }
        .button, a.button {
            width: 160px;
            outline: none;
            margin: 0;
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
            border: none;
            background-color: #1e88e5;
            font-size: 16px;
            color: white;
            padding: 15px 32px;
            text-align: center;
            box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
        }

        .button:hover, a.button:hover {
            background-color: #42a5f5;
            box-shadow: 0 12px 12px 0 rgba(0,0,0,0.24)
        }

        button:disabled {
            color: #bdbdbd;
            cursor: not-allowed;
        }
        button>a {
            display: inline-block
        }
        button>a:visited {
            color: white;
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