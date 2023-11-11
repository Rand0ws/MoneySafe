const API_URL = 'https://gold-tinted-stargazer.glitch.me/api';

export const getData = async (url) => {
  try {
    const response = await fetch(`${API_URL}${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при удалении данных:', error);
    throw error;
  }
};
