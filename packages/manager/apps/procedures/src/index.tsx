import React, { ChangeEvent, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import '@ovhcloud/ods-theme-blue-jeans';

import './global.css';
import './index.scss';

const App = lazy(() => import('./App'));

let testMode = false;
let user: any = null;

if (window.location.hash === '') {
  testMode = true;
  user = {
    subsidiary: '',
    language: '',
    legalForm: '',
    email: 'se***************@ov******.com',
    getStatusResult: '0',
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + 60 * 60,
  };
}

function changeLanguage(evt: ChangeEvent<HTMLSelectElement>) {
  user.language = evt.target.value;
}

function changeSub(evt: ChangeEvent<HTMLSelectElement>) {
  user.subsidiary = evt.target.value;
}

function changeLegalForm(evt: ChangeEvent<HTMLSelectElement>) {
  user.legalForm = evt.target.value;
}

function changeGetStatusResult(evt: ChangeEvent<HTMLSelectElement>) {
  user.getStatusResult = evt.target.value;
}

function changeExpiration(evt: ChangeEvent<HTMLSelectElement>) {
  switch (evt.target.value) {
    case '0':
      user.iat = Date.now() / 1000;
      user.exp = user.iat + 60 * 60;
      break;
    case '1':
      user.iat = Date.now() / 1000 - (60 - 15.5) * 60;
      user.exp = user.iat + 60 * 60;
      break;
    case '2':
      user.iat = Date.now() / 1000 - (60 - 0.5) * 60;
      user.exp = user.iat + 60 * 60;
      break;
    default:
      break;
  }
}

function createToken() {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const encodedHeaders = btoa(JSON.stringify(header));

  const encodedPayload = btoa(JSON.stringify(user));

  const encodedSignature = btoa('fakeSignature');

  return `${encodedHeaders}.${encodedPayload}.${encodedSignature}`;
}

function redirect(page: string): void {
  if (!user) {
    return;
  }

  const token = createToken();
  window.location.href += `#/${page}/?token=${token}`;
  window.location.reload();
}

const selectStyle =
  'w-30 mb-5 ml-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer';
const buttonStyle =
  'bg-blue-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {!testMode && <App />}
    {testMode && (
      <>
        <form className="p-5">
          <div className={'row'}>
            <label>Langue :</label>
            <select
              onChange={changeLanguage}
              defaultValue={user.language}
              className={selectStyle}
            >
              <option value={''}>Vide (= défault)</option>
              <option value={'fr_FR'}>Français</option>
              <option value={'de_DE'}>Allemand</option>
              <option value={'es_ES'}>Espagnol</option>
              <option value={'pl_PL'}>Polonais</option>
              <option value={'it_IT'}>Italien</option>
              <option value={'pt_PT'}>Portugais</option>
              <option value={'en_GB'}>Anglais</option>
              <option value={'fr_CA'}>Français (Canada)</option>
            </select>
          </div>
          <div className={'row'}>
            <label>Subsidiary :</label>
            <select
              onChange={changeSub}
              defaultValue={user.subsidiary}
              className={selectStyle}
            >
              <option value={''}>Vide (= défault)</option>
              <option value={'FR'}>FR</option>
              <option value={'DE'}>DE</option>
              <option value={'ES'}>ES</option>
              <option value={'PL'}>PL</option>
              <option value={'IE'}>IE</option>
              <option value={'IT'}>IT</option>
              <option value={'NL'}>NL</option>
              <option value={'PT'}>PT</option>
              <option value={'GB'}>GB</option>
              <option value={'CZ'}>CZ</option>
              <option value={'FI'}>FI</option>
              <option value={'LT'}>LI</option>
              <option value={'LTE'}>LTE</option>
              <option value={'CA'}>CA</option>
              <option value={'QC'}>QC</option>
              <option value={'WS'}>WS (World Spanish)</option>
              <option value={'TN'}>TN</option>
              <option value={'MA'}>MA</option>
              <option value={'SN'}>SN</option>
              <option value={'AU'}>AU</option>
              <option value={'ASIA'}>ASIA</option>
              <option value={'SG'}>SG</option>
              <option value={'IN'}>IN</option>
              <option value={'WE'}>WE (World English)</option>
            </select>
          </div>
          <div className={'row'}>
            <label>Type de compte (legal form) :</label>
            <select
              onChange={changeLegalForm}
              defaultValue={user.legalForm}
              className={selectStyle}
            >
              <option value={''}>Vide (= défault)</option>
              <option value={'individual'}>Individuel</option>
              <option value={'corporation'}>Entreprise</option>
              <option value={'association'}>Association</option>
              <option value={'administration'}>Administration</option>
              <option value={'other'}>Autre</option>
            </select>
          </div>
          <div className={'row'}>
            <label>Statut de la requête :</label>
            <select
              onChange={changeGetStatusResult}
              defaultValue={user.language}
              className={selectStyle}
            >
              <option value={'0'}>Procédure existante</option>
              <option value={'1'}>Procédure non existante</option>
              <option value={'2'}>Echec du challenge invisible</option>
            </select>
          </div>
          <div className={'row'}>
            <label>Expiration de la "session" :</label>
            <select
              onChange={changeExpiration}
              defaultValue={user.language}
              className={selectStyle}
            >
              <option value={'0'}>dans 1h</option>
              <option value={'1'}>
                dans 15min30 (affichage warning dans 30s)
              </option>
              <option value={'2'}>
                dans 30s (affichage expiration dans 30s)
              </option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className={buttonStyle}
              onClick={() => redirect('account-disable-2fa')}
            >
              Go to 2FA
            </button>
            <button
              type="button"
              className={buttonStyle}
              onClick={() => redirect('exercising-your-rights')}
            >
              Go to GDPR
            </button>
          </div>
        </form>
      </>
    )}
  </React.StrictMode>,
);
