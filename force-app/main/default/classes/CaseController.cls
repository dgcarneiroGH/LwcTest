/**
 * @description       :
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             :
 * @last modified on  : 10-25-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 **/
public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCasesByAccountId(Id accountId) {
        List<Case> cases = [SELECT Id, CaseNumber, Type, SubType__c, Reason, ContactId, Status, Priority, Origin, CreatedDate, 
        Contact.Name, Contact.Email, Contact.Phone FROM Case WHERE AccountId = :accountId];
        System.debug(cases.size());
        return cases;
        // return [SELECT Id, CaseNumber, Type, SubType__c, Reason, ContactId FROM Case WHERE AccountId = :accountId];
    }
    
}