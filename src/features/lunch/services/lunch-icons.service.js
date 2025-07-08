
class LunchIcons {
  icons = ['🍌','🥯','🍔','🍜','🥗','🍣','🍵','🍽️'];

  getRandomLunchIcon() {
    const len = this.icons.length;
    return this.icons[~~(Math.random() * len)];
  }
}

export default new LunchIcons();
