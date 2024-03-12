export class NavigationBar {
  constructor(
    public leftSidebarButton = (page: string) => cy.get(`.navButton [href="${page}"]`),
    public userAvatarButton = () => cy.get('#header #user'),
    public horizontalNavBar = () => cy.get('#header #nav'),
    public topBarButton = (tab: string) => cy.get(`.topLink[href="${tab}"]`),
    public projectsDropDown = () => cy.get('#header .projectDropDown'),
    public userIconButton = () => cy.get('ant-avatar ant-avatar-circle ant-avatar-icon'),
  ) {}

  clickLeftSidebarButton(page: string, opt?: Partial<Cypress.ClickOptions>) {
    this.leftSidebarButton(page).click(opt)
    this.horizontalNavBar().should('be.visible')

    return this
  }
  
  clickUserAvatarButton(opt?: Partial<Cypress.ClickOptions>) {
    this.userAvatarButton().click(opt)

    return this
  }

  clickTopBarButton(tab: string, opt?: Partial<Cypress.ClickOptions>) {
    this.topBarButton(tab).click(opt)
    this.horizontalNavBar().should('be.visible')

    return this
  }

  selectProject(projectName: string) {
    this.projectsDropDown().should('be.visible').click()
    cy.get('li').contains(projectName).should('be.visible').click()
    this.projectsDropDown().should('be.visible')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.projectsDropDown()
      // @ts-ignore
      .text()
      .then(($text: string) => {
        expect($text).include(projectName)
      })
  }

  clickUserButton(opt?: Partial<Cypress.ClickOptions>) {
    this.userIconButton().click(opt)

    return this
  }
}

export default new NavigationBar()
