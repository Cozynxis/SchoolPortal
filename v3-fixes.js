/* Small resilient event-delegation layer for V3. */
(() => {
  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close-modal]');
    if (close) document.querySelector('#modal')?.close();

    const classOpen = event.target.closest('[data-select-class][data-teacher-page]');
    if (classOpen) {
      window.SP.state.selectedClassId = classOpen.dataset.selectClass;
      window.SP.save();
      window.SPApp.goTeacher(classOpen.dataset.teacherPage);
    }

    const brand = event.target.closest('.student-brand[data-page]');
    if (brand) window.SPApp.goStudent(brand.dataset.page);
  });
})();