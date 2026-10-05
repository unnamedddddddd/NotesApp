type RelativeDate = {
  label: string;      
  time: string; 
};

const getRelativeDateString = (updatedAt: number): RelativeDate => {
  const targetDate = new Date(updatedAt);
  const now = new Date();

  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  ).getTime();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const oneDay = 24 * 60 * 60 * 1000;
  const diff = today - targetDay;

  const time = targetDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diff === 0) return { label: 'Сегодня', time };
  if (diff === oneDay) return { label: 'Вчера', time};
  if (diff === oneDay * 2) return { label: 'Позавчера', time };

  const label = targetDate
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(' г.', '');

  return { label, time};
};

export default getRelativeDateString;