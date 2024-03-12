export class FilterBar {
  constructor(
    public filterDropdownByName = (name: string) => cy.get(`.filterbar .filterDropDownsDiv #${name}Filter  .filterButton`),
    public flowSearchField = () => cy.get('.ant-select-search__field'),
    public flowSearchSelectTree = () => cy.get('.ant-select-tree')
  ) {}

  checkSelectedPattern(patternName: string) {
    this.filterDropdownByName('pattern').should('have.text', patternName)

    return this
  }

  checkSelectedFlow(flowName: string) {
    this.filterDropdownByName('flow').should('have.text', flowName)

    return this
  }

  checkSelectedChannel(channelName: string) {
    this.filterDropdownByName('channel').should('have.text', channelName)

    return this
  }

  selectPattern(patternName: string) {
    this.filterDropdownByName('pattern').should('be.visible').click()
    cy.get('li').find('span').contains(patternName).click()
    this.filterDropdownByName('pattern').find('span').contains(patternName)

    return this
  }

  selectFlow(flowName: string) {
    this.filterDropdownByName('flow').should('be.visible').click()
    cy.get('li').find('span').contains(flowName).click()
    this.filterDropdownByName('flow').find('span').contains(flowName)

    return this
  }

  searchFlow(flowName: string) {
    this.filterDropdownByName('flow').should('be.visible').click()
    this.flowSearchField().should('be.visible').type(flowName)
    
    return this
  }

  checkFlowSearchResult(flowName: string) {
    this.filterDropdownByName('flow').should('be.visible').click()
    this.flowSearchSelectTree().contains(flowName).should('be.visible')
    return this
  }

  getFlowFiltersContainer(flowName: string) {
    this.filterDropdownByName('flow').should('be.visible').click()
   }

  openChannelDropdown(opt?: Partial<Cypress.ClickOptions>) {
    this.filterDropdownByName('channel').should('be.visible').click(opt)
  }
}

export default new FilterBar()
