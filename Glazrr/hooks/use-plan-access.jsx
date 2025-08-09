import { useAuth } from "@clerk/nextjs";
import { Crop } from "lucide-react";

export function usePlanAccess() {

    const { has } = useAuth();

    const isPro = has?.({ plan: "pro" }) || false;
    const isFree = !isPro;

    // Getting The Plan Access
    const planAccess = {

        // Free Plan Access
        resize: true,
        crop: true,
        adjust: true,
        text: true,

        // Pro Plan Access
        background: isPro,
        ai_extender: isPro,
        ai_edit: isPro,

    };

    // Getting The Plan has The tool or not...
    const hasAccess = (toolId) => {
        return planAccess[toolId] === true;
    };
    
    // The restricted tools...
    const getRestrictedTools = () => {
        return Object.entries(planAccess)
            .filter(([_, hasPlanAccess]) => !hasPlanAccess)
            .map(([toolId]) => toolId);
    };

    // Getting the limit of the project...
    const canCreateProject = (currentProjectCount) => {
        if(isPro){
            return true;
        }

        // Free limit...
        return currentProjectCount < 3;
    };
    
    // Getting the limit of the Exports...
    const canExport = (currentExportThisMonth) => {
        if(isPro){
            return true;
        }

        // Free limit...
        return currentExportThisMonth < 20;
    };

    return{
        userPlan: isPro ? "pro" : "free",
        isPro,
        isFree,
        hasAccess,
        planAccess,
        getRestrictedTools,
        canCreateProject,
        canExport
    }
    

}