/// <reference types="cypress" />

describe('take-home coding test', () => {
    beforeEach(() => {
        cy.visit('https://www.businessinsider.com/ikea-nyc-store-planning-studio-tour-2019-4', {
            onBeforeLoad(window) {
                delete window.navigator.__proto__.clipboard
            }
        })
        .then(() => {  
            //todo - find better way of giving the cookie iframe time to load in
            cy.wait(2500)     
            cy.get('body').then((body) => {
                if (body.find('div#sp_message_container_364840').length) {
                    cy.get('div#sp_message_container_364840')
                    .as('iframe')
        
                    //todo - interact with cookie iframe - shows in EU only. Just removing it for simplicity sake as wasn't straightforward to interact with

                    cy.get('@iframe').then((el) => {      
                        if(el) {
                            el.remove()
                        }          
                    })
                }
            })            
        })
    })

    it('Share menu can be opened', () => {        
        cy.openShareMenu()
        .then(() => {
            cy.get('div.dropdown-menu.not-menu-only').should('be.visible')
        })
    })
    
    it('Twitter link opens in new window', () => {        
        var shareMenuItemSelector = 'div.dropdown-menu.not-menu-only span.dropdown-menu-item > span[label="twitter"]'
        var shareMenuItemLink = "https://twitter.com/intent/tweet?text=I%20visited%20Ikea's%20new%20Manhattan%20location%20%E2%80%94%20and%20it%20was%20like%20nothing%20else%20I've%20seen%20from%20the%20retailer&url=https%3A%2F%2Fwww.businessinsider.com%2Fikea-nyc-store-planning-studio-tour-2019-4%3FutmSource%3Dtwitter%26utmContent%3Dreferral%26utmTerm%3Dtopbar%26referrer%3Dtwitter&via=businessinsider&utmSource=twitter&utmContent=referral&utmTerm=topbar&referrer=twitter"

        cy.openShareMenu()
        cy.verifyNewWindowOpens(shareMenuItemSelector, shareMenuItemLink)      
    })

    it('LinkedIn link opens in new window', () => {        
        var shareMenuItemSelector = 'div.dropdown-menu.not-menu-only span.dropdown-menu-item > span[label="linkedin"]'
        var shareMenuItemLink = "https://www.linkedin.com/shareArticle?url=https%3A%2F%2Fwww.businessinsider.com%2Fikea-nyc-store-planning-studio-tour-2019-4&title=I%20visited%20Ikea's%20new%20Manhattan%20location%20%E2%80%94%20and%20it%20was%20like%20nothing%20else%20I've%20seen%20from%20the%20retailer&summary=Ikea%20is%20opening%20a%20planning%20studio%20in%20Manhattan%2C%20the%20first%20center%20of%20its%20kind%20in%20the%20United%20States.&mini=true&utmSource=linkedIn&utmContent=referral&utmTerm=topbar&referrer=linkedIn"

        cy.openShareMenu()
        cy.verifyNewWindowOpens(shareMenuItemSelector, shareMenuItemLink)     
    })    

    it('Flipboard link opens in new window', () => {        
        var shareMenuItemSelector = 'div.dropdown-menu.not-menu-only span.dropdown-menu-item > span[label="flipboard"]'
        var shareMenuItemLink = "https://share.flipboard.com/bookmarklet/popout?url=https%3A%2F%2Fwww.businessinsider.com%2Fikea-nyc-store-planning-studio-tour-2019-4&title=I%20visited%20Ikea's%20new%20Manhattan%20location%20%E2%80%94%20and%20it%20was%20like%20nothing%20else%20I've%20seen%20from%20the%20retailer&v=2&utmSource=flipboard&utmContent=referral&utmTerm=topbar&referrer=flipboard"

        cy.openShareMenu()
        cy.verifyNewWindowOpens(shareMenuItemSelector, shareMenuItemLink)             
    })

    //test below is based on https://stackoverflow.com/questions/61650737/how-to-fetch-copied-to-clipboard-content-in-cypress
    it('Copy link copies the hyperlink', () => {
        cy.openShareMenu()
        .then(() => {
            cy.get('div.dropdown-menu.not-menu-only span.dropdown-menu-item > span').each((el) => {            
                if(el.prop('title').includes('Share on') || el.prop('title').includes('Copy link')) {
                    cy.log(el.prop('title'))
                }

                if(el.prop('title') == 'Copy link') {
                    cy.document().then(document => cy.stub(document, 'execCommand').as('exec'))
                    
                    cy.wrap(el).click()
                    .then(() => {            
                        cy.get('@exec').should('have.been.calledOnceWith', 'copy')
                    })
                }

                //todo - maybe insert a textbox into the DOM then paste the clipboard contents 
                //there and assert contents are as expected

                //todo - check the 'copied' toast popup appears
            })
        })
    }) 

    //todo - create test cases below
    //save article button
    //facebook button
    //email article button

    it('Links on Business Insider Latest page return http 200 response', () => {
        cy.visit('https://www.businessinsider.com/latest')
        .then(() => {     
            //todo - find better way of giving the cookie iframe time to load in
            cy.wait(2500)       
            cy.get('body').then((body) => {
                if(body.find('div#sp_message_container_364840').length) {
                    cy.get('div#sp_message_container_364840')            
                    .as('iframe')
        
                    //todo - interact with cookie iframe - shows in EU only. Just removing it for simplicity sake as wasn't straightforward to interact with

                    cy.get('@iframe').then((el) => {      
                        if(el) {
                            el.remove()
                        }          
                    })
                }
            })            
        })

        var non200Responses = 0
        cy.get('section.river-item.featured-post')
        .find('a.tout-title-link')
        .each((el) => {
            cy.wrap(el).invoke('attr', 'href')
            .then((href) => {
                cy.log('About to try loading the following url: ' + href)

                cy.request({
                    url: href,
                    failOnStatusCode: false
                })
                .then((response) => {
                    cy.log('Response: ' + response.status)
                    if(response.status !== 200) {
                        cy.log('Non 200 code response: ' + response.status)
                        non200Responses++
                    }                    
                })
            })
        })
        .then(() => {
            expect(non200Responses, 'Expected there to be 0 non-200 responses, but there were ' + non200Responses).to.equal(0)
        })        
    })    
})