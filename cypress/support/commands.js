Cypress.Commands.add('openShareMenu', () => {
    cy.get('div.dropdown-menu.not-menu-only').should('not.be.visible')
    cy.get('span.share-icon-button.share-link.share-icon', {timeout: 5000}).should('be.visible').click()
    .then(() => {
        cy.get('div.dropdown-menu.not-menu-only')
        .then((el) => {
            //Check if menu is visible and retry if it's not
            if(el.is(':visible')) {
                cy.log('Share menu items visible')
            } else {
                cy.log('Share menu items NOT visible - retrying')
                return cy.openShareMenu()
            }
        })
    })
})

Cypress.Commands.add('verifyNewWindowOpens', (shareMenuItemSelector, shareMenuItemLink) => {
    cy.on('uncaught:exception', (err) => {
        //ensure the error is the one we expect
        expect(err.message).to.include("Cannot read properties of undefined (reading 'focus')")
        return false
    })

    //below test based on the following: https://articles.wesionary.team/handling-new-browser-tab-and-window-in-cypress-458f7625e5d9
    cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen')
    })

    cy.get(shareMenuItemSelector).click()
    cy.get('@windowOpen').should('be.calledOnceWith', shareMenuItemLink)    
})