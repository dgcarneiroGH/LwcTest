/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class CaseControllerTest {
    
    @testSetup
    static void setup() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        Case testCase1 = new Case(
            AccountId = testAccount.Id,
        Type = 'Problem',
        SubType__c = 'Technical',
        Reason = 'Installation',
        ContactId = '003xx000004TmiQAAS'
            );
        Case testCase2 = new Case(
            AccountId = testAccount.Id,
        Type = 'Question',
        SubType__c = 'Usage',
        Reason = 'How To',
        ContactId = '003xx000004TmiRAAS'
            );
        insert new List<Case>{ testCase1, testCase2 };
    }
    
    @isTest
    static void testGetCasesByAccountId() {
        //Arrange
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        
        //Act
        List<Case> cases = CaseController.getCasesByAccountId(testAccount.Id);
        
        //Assert
        System.assertNotEquals(0, cases.size(), 'Cases associated with the account were expected');
        System.assertEquals(2, cases.size(), 'Two cases associated with the account were expected');
        System.assertEquals('Problem', cases[0].Type, 'Type does not match');
        System.assertEquals('Question', cases[1].Type, 'Type does not match');
    }
    
    @isTest
    static void testGetCasesByAccountIdNoCases() {
        //Arrange
        Account emptyAccount = new Account(Name = 'Empty Account');
        insert emptyAccount;
        
        //Act
        List<Case> cases = CaseController.getCasesByAccountId(emptyAccount.Id);
        
        //Assert
        System.assertEquals(0, cases.size(), 'No cases expected');
    }
}