import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {
    return (
      <div className="home_container">
        <section className="hero_section">
        <h2>👹 Керуйте крипторинком як демон</h2>
        <p>Інтуїтивна платформа для торгівлі, з просунутими ордерами, live-графіками та повним контролем над ризиками.</p>
        <button className="cta_btn"><Link to="/trade" className='link'>Почати торгівлю</Link></button>
      </section>

      <section className="features_section">
        <div className="feature_card">
          <h3>⚡ Миттєва торгівля</h3>
          <p>Надшвидке виконання ордерів. Ніяких лагів — тільки результат.</p>
        </div>
        <div className="feature_card">
          <h3>🛡️ Керування ризиком</h3>
          <p>Тейк-профіт, стоп-лосс, кредитне плече — все під контролем.</p>
        </div>
        <div className="feature_card">
          <h3>📊 Живі графіки</h3>
          <p>Технічний аналіз в реальному часі. Повна картина ринку.</p>
        </div>
      </section>

      <section className="market_widget">
        <h3>📈 Тренди ринку</h3>
        <div className="widget_placeholder">[ 🔴 Тут буде графік або новини ]</div>
      </section>

      </div>
    );
  };
  
export default Home;