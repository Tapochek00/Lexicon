import UserData from './Data';

class MainFunctions {
  /**
   * Обращение к БД
   * @param {string} entity Сущность
   * @param {"GET" | "POST" | "PUT" | "DELETE"} method Метод запроса
   * @param {*} data Данные, отправляемые с запросом в формате JSON
   * @returns {*} объект Promise с результатом запроса при методе GET или POST, объект Response при методе PUT или DELETE
   */
  async request(entity, method = 'GET', data = null) {
    try {
      let body;
      const url = 'http://192.168.0.196:5016/api/' + entity;

      if (data) {
        body = JSON.stringify(data);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (method == 'DELETE' || method == 'PUT') return response;
      return await response.json();
    } catch (ex) {
      console.error(ex.message);
    }
  }

  /**
   * Загрузка всех папок пользователя
   * @param {number | undefined} userId номер пользователя
   * @returns папки пользователя
   */
  async loadFolders(userId) {
    const foldersRes = await this.request('folders');
    let res;
    if (userId && userId != UserData.user.id) {
      res = foldersRes.filter(f => f.creator == userId && !f.private);
    } else {
      res = foldersRes.filter(f => f.creator == UserData.user.id);
      UserData.folders = res;
    }
    return res;
  }

  /**
   * Получение всех коллекций пользователя
   * @param {number | undefined} userId номер пользователя
   * @returns Коллекции пользователя
   */
  async loadUserCollections(userId) {
    const collections = await this.request('collections');
    let res;
    if (userId && userId != UserData.user.id) {
      res = collections.filter(c => c.creator == userId && !c.private);
    } else {
      res = collections.filter(c => c.creator == UserData.user.id);
      UserData.collections = res;
    }
    return res;
  }

  /**
   * Получение коллекций пользователя в папке
   * @param {number} folderId номер папки
   * @param {number | undefined} userId номер пользователя
   * @returns Коллекции пользователя в папке
   */
  async loadFolderCollections(folderId) {
    let res;
    const collections = await this.request('collections');
    if (folderId != 0) {
      res = collections.filter(c => c.folder == folderId);
    } else {
      res = collections.filter(c => !c.folder);
    }

    return res;
  }

  /**
   * Получение карточек коллекции
   * @param {number} collectionId номер коллекции
   * @returns Кароточки
   */
  async loadCollectionCards(collectionId) {
    try {
      const cards = await this.request('cards');
      const cardcollections = await this.request('cardcollections');
      const cardIds = cardcollections
        .filter(c => c.collection == collectionId)
        .map(c => c.card);

      return cards.filter(c => cardIds.includes(c.id));
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Добавление дней к дате
   * @param {Date} date Дата
   * @param {int} days Количество дней
   * @returns Дата после добавления дней
   */
  addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   *
   * @param {Date} date Дата
   * @returns Дата в строке формата yyyy-MM-ddThh:mm:00.000Z
   */
  dateToString(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const fulldate = {
      year: date.getFullYear(),
      month: month < 10 ? `0${month}` : month,
      day: day < 10 ? `0${day}` : day,
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
    };
    const datetime =
      `${fulldate.year}-` +
      `${fulldate.month}-` +
      `${fulldate.day}T` +
      `${fulldate.hours}:` +
      `${fulldate.minutes}:00.000Z`;
    return datetime;
  }

  /**
   * Добавление папки, коллекции или карты в коллекцию текущему пользователю
   * @param {*} item Папка/коллекция/карта в коллекцию
   * @param {"folders" | "collections" | "cardcollections"} entity Сущность
   * @param {*} props дополнительные параметры
   * @returns Добавленная папка/коллекция/карта в коллекцию
   */
  async copyItem(item, entity, props) {
    const temp = {...item};
    if (temp.id) delete temp['id'];
    if (temp.creator) temp.creator = UserData.user.id;
    for (const key in props) {
      temp[`${key}`] = props[`${key}`];
    }

    return await this.request(entity, 'POST', temp);
  }

  /**
   * Добавление коллекции текущему пользователю со всеми картами в ней
   * @param {*} item Коллекция
   * @param {number | null | undefined} folder Номер папки
   */
  async copyCollection(item, folder) {
    const collection = await this.copyItem(item, 'collections', {folder});
    const cards = await this.loadCollectionCards(item.id);
    const cardsCreated = [];
    const currentDate = new Date();
    const date = this.dateToString(currentDate);
    for (const card of cards) {
      const temp = await this.copyItem(card, 'cards', {
        NextRepeat: date,
        RepeatInterval: 1,
      });
      cardsCreated.push(temp);
    }
    for (const card of cardsCreated) {
      const temp = {
        collection: collection.id,
        card: card.id,
      };
      this.copyItem(temp, 'cardcollections');
    }
  }

  /**
   * Добавление папки текущему пользователю со всеми неприватными коллекциями, входящими в неё
   * @param {*} item Папка
   */
  async copyFolder(item) {
    const folder = await this.copyItem(item, 'folders');
    this.loadFolderCollections(item.id).then(res => {
      res.filter(c => !c.private).map(c => this.copyCollection(c, folder.id));
    });
  }
}

export default new MainFunctions();
