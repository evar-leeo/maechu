
class LunchIcons {
  icons = ['🍌','🥯','🍔','🍜','🥗','🍣','🍵','🍽️'];

  getRandomLunchIcon() {
    const len = this.lunchIcons.length;
    return this.lunchIcons[~~(Math.random() * len)];
  }
}

export default new LunchIcons();
