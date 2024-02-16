export const imageLoaded = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  if (!e.currentTarget.parentElement) {
    return;
  }
  e.currentTarget.parentElement.style.backgroundImage = '';
};

export const imageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  url: string = 'img-not-found.png',
  contain: boolean = false
) => {
  if (!e.currentTarget.parentElement) {
    return;
  }
  if (contain) {
    e.currentTarget.parentElement.classList.add('bg-contain');
  }
  e.currentTarget.parentElement.style.backgroundImage = `url(${url})`;
};
