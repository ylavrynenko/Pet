import { dataObject } from '../../fixtures/data/data-spec-node-details'
import FilterBar from '../../classes/bars/FilterBar.ts'
import DiagramToolbar from '../../classes/DiagramToolbar'
import NodeDetailsPanel from '../../classes/NodeDetailsPanel'
import { DesignerTopBarHrefs } from '../../fixtures/navigation-data/designer-top-bar-hrefs'
import NavigationBar from '../../classes/navigation/NavigationBar.ts'

describe('Save Layout test', () => {
  let createdProjectInfo = {}

  before(function () {
    cy.readFile('./cypress/fixtures/projects-templates/save-layout-spec-project.json').then(($json) => {
      cy.createProject(Cypress.env('baseUrlAPI'), Cypress.env('username'), Cypress.env('password'), $json).then(
        ($projectInfo) => {
          createdProjectInfo = $projectInfo
        },
      )
    })

    cy.UILogin(Cypress.env('username'), Cypress.env('password'))
    Cypress.LocalStorage.clear = function (keys, ls, rs) {
      if (keys) {
      }
    }
  })

  beforeEach(function () {
    // prevents cypress failure on api/reporting requests exceptions
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })
    // sets view port to fixed size
    cy.viewport(1200, 800)

    // restore localstorage
    cy.restoreLocalStorage()
  })

  it('Select project', () => {
    cy.selectProject(createdProjectInfo.label)
    cy.get('div').contains(createdProjectInfo.label).should('be.visible')
  })

  it('Select a pattern', () => {
    cy.get('.topLink').contains('Patterns').should('be.visible').click()
    cy.url().should('contain', '/patterns')
    FilterBar.selectPattern('general')
  })

  it('Save custom layout', () => {
    let tools = new DiagramToolbar()
    let nodeDetails = new NodeDetailsPanel()
    let subflowLoc
    let skillLoc
    let tagLoc

    cy.moveNode(dataObject.pattern_diagram.tag.nodeLabel, -250, 0)
    cy.moveNode(dataObject.pattern_diagram.skillsrouter.nodeLabel, +250, 0)
    cy.moveNode(dataObject.pattern_diagram.subflow.nodeLabel, -125, 0)

    tools
      .saveLayoutButton()
      .click()
      .then(() => {
        cy.get('.ant-message-notice').find('span').contains('Layout saved successfully.').should('be.visible') // toast message visible

        // get coordinates before leaving
        cy.getNodeLocation(dataObject.pattern_diagram.subflow.nodeLabel).then(($loc) => {
          subflowLoc = $loc
        })
        cy.getNodeLocation(dataObject.pattern_diagram.skillsrouter.nodeLabel).then(($loc) => {
          skillLoc = $loc
        })
        cy.getNodeLocation(dataObject.pattern_diagram.tag.nodeLabel).then(($loc) => {
          tagLoc = $loc
        })

        // reload
        NavigationBar.clickTopBarButton(DesignerTopBarHrefs.outcomes)
        NavigationBar.clickTopBarButton(DesignerTopBarHrefs.patterns)
        cy.window().should('have.property', 'go')
        if (nodeDetails.element) {
          nodeDetails.close()
        }
        // assert coordinates
        cy.getNodeLocation(dataObject.pattern_diagram.subflow.nodeLabel).then(($loc) => {
          expect($loc.x).equals(subflowLoc.x)
        })
        cy.getNodeLocation(dataObject.pattern_diagram.skillsrouter.nodeLabel).then(($loc) => {
          expect($loc.x).equals(skillLoc.x)
        })
        cy.getNodeLocation(dataObject.pattern_diagram.tag.nodeLabel).then(($loc) => {
          expect($loc.x).equals(tagLoc.x)
        })
      })
  })

  afterEach(function () {
    // preserve local storage after each hook
    cy.saveLocalStorage()
  })

  after(function () {
    cy.deleteProject(Cypress.env('baseUrlAPI'), Cypress.env('username'), Cypress.env('password'), createdProjectInfo.id)
  })
})
