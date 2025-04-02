import s from './Variables.module.scss';

export const Variables = () => {
  return (
    <article className={s.variables}>
      <section className={s.variables__section}>
        <div className={s.variables__container}>
          <h3>Add Variable</h3>
          <div className={s.variables__inputContainer}>
            <input type="text" placeholder="Key..." />
            <input type="text" placeholder="Data..." />
            <button>Add</button>
          </div>
        </div>
        <div>
          <h3>Current Variables</h3>
        </div>
      </section>
    </article>
  );
};
