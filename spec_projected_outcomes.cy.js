import { OutcomesPageElements } from '../../../classes/outcomesPage.js';
import { contentsOutcomes } from '../../../fixtures/data/outcomesTestData.js';

/* const OutcomesPageElements  = require('../../../classes/outcomesPage.js')
const contentsOutcomes  = require('../../../data/outcomesTestData.js')  */

describe('table Projected Outcomes', function () {
  before(() => {
    cy.getToken()
    cy.fixture("metrics-templates/projected-outcomes.json").then($json =>{
      cy.request({
      method: 'PUT',
      url: Cypress.env('baseUrlAPI') + '/api/projects/' + Cypress.env('projectId'),
      headers: {
       Authorization: "Bearer " + Cypress.env('token'),
      },
      body: $json
      })
    })
    cy.UILogin(Cypress.env('username'), Cypress.env('password'))
    cy.selectProject(Cypress.env('projectName'))
  })

  it('CMTS-6-create-new-projected-outcome', { tags: ['@smoke', '@regression']}, () => {
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    cy.fillOutcome(contentsOutcomes.projectedOutcomeLbl, contentsOutcomes.outcomeDescription, contentsOutcomes.outcomePercentage, contentsOutcomes.outcomeValueNeutral, contentsOutcomes.outcomeColor )
    cy.get(OutcomesPageElements.validationMsg).should('not.exist')
    cy.get(OutcomesPageElements.addProjectedOutcomeBtn).click()
    cy.checkOutcomeFields(contentsOutcomes.projectedOutcomeLbl, contentsOutcomes.outcomePercentage, contentsOutcomes.outcomeValueNeutral, contentsOutcomes.outcomeColor, contentsOutcomes.outcomeDescription)

    // check if new projected outcome appears in select Outcomes on modal Create New Global Pattern
    cy.get(OutcomesPageElements.openCreateNewGlobalPatternBtn).click()
    cy.get(OutcomesPageElements.globalPatternOutcomesSelect).click()
    cy.get('li.ant-select-dropdown-menu-item').contains(contentsOutcomes.projectedOutcomeLbl).should('exist')
    cy.get(OutcomesPageElements.openCreateNewGlobalPatternBtn).click()

    // check if new projected outcome appears on page Patterns

    OutcomesPageElements.getEditBtn(OutcomesPageElements.patternTable, 'PatternToTestOutcomes').click()
    cy.multiselect(OutcomesPageElements.patternOutcomesLbl, [contentsOutcomes.projectedOutcomeLbl, 'HITL'])
    cy.get(OutcomesPageElements.addGlobalPatternBtn).filter(':visible').click()
    cy.contains('.topLink', 'Patterns').should('be.visible').click()
    cy.selectPattern('PatternToTestOutcomes')
    cy.contains('.circleLabel', contentsOutcomes.projectedOutcomeLbl).should('exist')
    cy.contains('.topLink', 'Outcomes').should('be.visible').click()
  })

  it('CMTS-9-edit-projected-outcome', { tags: ['@smoke', '@regression']},  () => {
    OutcomesPageElements.getEditBtn(OutcomesPageElements.projectedOutcomesTable, 'ProjectedOutcomeToEdit').click()

    cy.fillOutcome(contentsOutcomes.projectedOutcomeUpdated, contentsOutcomes.outcomeDescriptionUpdated, contentsOutcomes.outcomePercentageUpdated, contentsOutcomes.outcomeValueUpdated, contentsOutcomes.outcomeColorUpdated )
    cy.get(OutcomesPageElements.addProjectedOutcomeBtn).filter(':visible').click()

    // check if new outcome is updated
    cy.checkOutcomeFields(contentsOutcomes.projectedOutcomeUpdated, contentsOutcomes.outcomePercentageUpdated, contentsOutcomes.outcomeValueUpdated, contentsOutcomes.outcomeColorUpdated, contentsOutcomes.outcomeDescriptionUpdated)
  })

  it('CMTS-100-delete-projected-outcome', { tags: ['@smoke', '@regression']}, () => {
    // delete created and updated outcome
    OutcomesPageElements.getDeleteBtn(OutcomesPageElements.projectedOutcomesTable, 'ProjectedOutcomeToDelete').click({ force: true })

    //check if message Deleted outcome appears
    cy.checkToastMsg('Deleted outcome')

    // check if outcome is deleted
    cy.contains(OutcomesPageElements.outcomeRow, 'ProjectedOutcomeToDelete').should('not.exist')
  })

  it('CMTS-101-reset-functionality-while-outcomes-adding', { tags: '@regression'}, () => {
    // fill pop-up Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).should('be.visible').click()
    cy.fillOutcome(contentsOutcomes.projectedOutcomeLbl, contentsOutcomes.outcomeDescription, contentsOutcomes.outcomePercentage, contentsOutcomes.outcomeValueNeutral, contentsOutcomes.outcomeColor )

    // reset fields on pop-up add projected outcome
    cy.contains('Reset').should('be.visible').click()
    cy.get(OutcomesPageElements.outcomeNameField).should('have.value', '');
    cy.get(OutcomesPageElements.outcomeDescriptionField).should('have.value', '');
    cy.get(OutcomesPageElements.outcomePercentage).should('have.value', '33%');
    OutcomesPageElements.checkDefaultValue(OutcomesPageElements.outcomeValueSel, contentsOutcomes.outcomeDefaultValue)
    OutcomesPageElements.checkDefaultValue(OutcomesPageElements.outcomeColorSel, contentsOutcomes.outcomeDefaultColor)
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).should('be.visible').click()
  })

  it('CMTS-8819-to-validate-it-is-possible-to-create-the-outcome-with-empty-description', { tags: '@regression'}, () =>{
  cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
  cy.fillOutcome('ProjectedOutcomeNoDescription', '', contentsOutcomes.outcomePercentage, contentsOutcomes.outcomeValueNeutral, contentsOutcomes.outcomeColor )
  cy.get(OutcomesPageElements.addProjectedOutcomeBtn).click()
  cy.checkOutcomeFields('ProjectedOutcomeNoDescription', contentsOutcomes.outcomePercentage, contentsOutcomes.outcomeValueNeutral, contentsOutcomes.outcomeColor, '' )
  })

  it.skip('CMTS-9584-check-change-outcomes-colors', { tags: '@regression'}, () =>{
    OutcomesPageElements.getEditBtn(OutcomesPageElements.projectedOutcomesTable, 'HITL').click()
    cy.selectCustom(OutcomesPageElements.outcomeColorSel, ' #EB4627 ')
    cy.get(OutcomesPageElements.addProjectedOutcomeBtn).filter(':visible').click()
    cy.contains('.topLink', 'Patterns').should('be.visible').click()
    cy.selectPattern('PatternToTestOutcomes')
    cy.contains('.circleLabel', 'HITL').parent().prev().should('have.attr', 'style', 'background: rgb(235, 70, 39);')

  })

  describe('CMTS-8414-test-pack-for-projected-outcomes-validations', { tags: '@regression'}, () => {
    it('CMTS-8428-to-validate-it-is-not-possible-for-user-to-create-the-fallback-outcome-cause-it-is-default', () => {
      // open modal Create New Projected Outcome
      cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
      //CMTS-8428-to-validate-it-is-not-possible-for-user-to-create-the-fallback-outcome-cause-it-is-default
      OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.notUniqueErrMsg, OutcomesPageElements.outcomeNameField, 'Fallback', true)
      cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
      // close modal Create New Projected Outcome
    })

    it('check if all required color values are present in select Color', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    // check if all required color values are present in select Color
    cy.get(OutcomesPageElements.outcomeColorSel).filter(':visible').parent().next().find('[role="combobox"]').click()
    cy.get('.ant-select-dropdown-menu-root').filter(':visible').find('li').each(($item, i) => {
      expect($item.text()).to.equal(contentsOutcomes.colorSet[i])
    })
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message Please provide a unique condition label after clicking on button Add', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    // check if message 'Please provide a unique condition label' after clicking on button 'Add'
    cy.get(OutcomesPageElements.addProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.emptyFieldErrMsg, OutcomesPageElements.outcomeNameField, '', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8424-to-validate-the-name-with-33-characters-is-not-valid-outcome-s-name', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.lengthLimitErrMsg, OutcomesPageElements.outcomeNameField, contentsOutcomes.name33Letters, true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8421-to-validate-the-name-with-32-characters-including-special-characters-inside-is-a-valid', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.lengthLimitErrMsg, OutcomesPageElements.outcomeNameField, 'abcdfghABCDFGHIJKLMNOPQRSTUVWZYZ', false)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8415-to-validate-the-name-with-2-characters-is-a-valid-outcome-s-name', () => {
      // open modal Create New Projected Outcome
      cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
      OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.lengthLimitErrMsg, OutcomesPageElements.outcomeNameField, 'ab', false)
      // close modal Create New Projected Outcome
      cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8427-to-validate-it-is-not-possible-to-create-the-outcome-with-the-default-outcomes-name-which', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.notUniqueErrMsg, OutcomesPageElements.outcomeNameField, 'HITL', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8423-to-validate-the-name-with-1-character-is-not-valid-outcome-s-name', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.lengthLimitErrMsg, OutcomesPageElements.outcomeNameField, contentsOutcomes.oneLetter, true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('CMTS-8421-to-validate-the-name-with-32-characters-including-special-characters-inside-is-a-valid', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.lengthLimitErrMsg, OutcomesPageElements.outcomeNameField, contentsOutcomes.projectedOutcomeNameSpecSymbols, false)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if all messages diappear after clicking on the button Reset', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.emptyFieldErrMsg, OutcomesPageElements.outcomeNameField, '', true)
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomePercentageLabel, contentsOutcomes.percentageRequiredErrMsg, OutcomesPageElements.outcomePercentage, '', true)
    //check if all messages diappear after clicking on the button 'Reset'
    cy.contains('Reset').should('be.visible').click()
    cy.get(OutcomesPageElements.validationMsg).filter(':visible').should('not.exist')
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message Please provide a unique condition label after clicking in field Outcome Name and then clicl outside of field Outcome Name', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.emptyFieldErrMsg, OutcomesPageElements.outcomeNameField, '', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message Label must not contain spaces or underscores. appears if input space into outcome name', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.containSpacesErrMsg, OutcomesPageElements.outcomeNameField, 'a b', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message Label must not contain spaces or underscores. appears if input underscore into outcome name', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomeNameLabel, contentsOutcomes.containSpacesErrMsg, OutcomesPageElements.outcomeNameField, 'a_b', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message percentage is required appears if input letter into field Percentage', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomePercentageLabel, contentsOutcomes.percentageRequiredErrMsg, OutcomesPageElements.outcomePercentage, '', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check if message percentage is required appears if make empty field Percentage', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()

    OutcomesPageElements.checkValidationError(OutcomesPageElements.outcomePercentageLabel, contentsOutcomes.percentageRequiredErrMsg, OutcomesPageElements.outcomePercentage, 'a', true)
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check that can not input value more than 100 for field Percentage ', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()

    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').clear()
    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').type('101')
    cy.get('.ant-popover-title').filter(':visible').click()
    cy.get(OutcomesPageElements.outcomePercentage).should('have.attr','aria-valuenow', '100')
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check that can not input value less than 0 for field Percentage  ', () => {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()

    cy.get(OutcomesPageElements.outcomePercentage).clear()
    cy.get(OutcomesPageElements.outcomePercentage).type('-1')
    cy.get('.ant-popover-title').filter(':visible').click()
    cy.get(OutcomesPageElements.outcomePercentage).should('have.attr','aria-valuenow', '0')
    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check that can not set value more than 100 for field Percentage with arrow up', ()=> {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()

    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').clear()
    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').type('99')
    cy.get(OutcomesPageElements.increaseOutcomePercentage).invoke('show').click().should('have.attr', 'aria-disabled', 'true')

    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
    })

    it('check that can not set value less than 0 for field Percentage with arrow down', ()=> {
    // open modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()

    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').clear()
    cy.get(OutcomesPageElements.outcomePercentage).filter(':visible').type('1')
    cy.get(OutcomesPageElements.decreaseOutcomePercentage).invoke('show').invoke('show').click().should('have.attr', 'aria-disabled', 'true')

    // close modal Create New Projected Outcome
    cy.get(OutcomesPageElements.openCreateNewProjectedOutcomeBtn).click()
   })


  /*
    // check required fields Create Projected Outcome - low priority - WIP
    cy.get('label[title="Outcome Name"]').should('be.visible').and('have.class', '.ant-form-item-required')
    cy.get('.ant-form-item-label').find('label').contains('Outcome Name:').should('be.visible').and('have.class', '.ant-form-item-required')
    cy.get('label').contains('Outcome Name').should('be.visible').and('have.class', '.ant-form-item-required')
    cy.get('label[title="Value"]').should('be.visible').and('not.have.class', '.ant-form-item-required')
    cy.get('label[title="Color"]').should('be.visible').and('have.class', '.ant-form-item-required') */

  })

  after(() => {
    cy.fixture("metrics-templates/empty-project.json").then($json =>{
      cy.request({
        method: 'PUT',
        url: Cypress.env('baseUrlAPI') + '/api/projects/' + Cypress.env('projectId'),
        headers: {
          Authorization: "Bearer " + Cypress.env('token'),
        },
        body: $json
        })
      }).then(resp => {
        expect(resp.status).equals(201)
      })
  })
})



