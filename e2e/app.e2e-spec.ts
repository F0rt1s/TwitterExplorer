import { CovalentseedPage } from './app.po';

describe('covalentseed App', () => {
  let page: CovalentseedPage;

  beforeEach(() => {
    page = new CovalentseedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
