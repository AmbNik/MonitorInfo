import { ref } from "vue";
import applicationsApi from "@/api/applications";

export function useApplications() {
  const isLoading = ref<boolean>(false);
  const data = ref<any | null>(null);
  const error = ref<null>(null);

  function getApplicationsStart() {
    isLoading.value = true;
    data.value = null;
  }

  function getApplicationsSuccess(items: any) {
    isLoading.value = false;
    data.value = items;
  }

  function getApplicationsFailure(errors: any) {
    isLoading.value = false;
    error.value = errors;
  }

  async function getApplications(): Promise<any> {
    try {
      getApplicationsStart();
      const applications = await applicationsApi.getApplications();
      getApplicationsSuccess(applications);
      return applications;
    } catch (errors: any) {
      getApplicationsFailure(errors);

      throw errors;
    }
  }

  function ApplicationsStart() {
    isLoading.value = true;
  }

  function ApplicationsSuccess() {
    isLoading.value = false;
  }

  function ApplicationsFailure(errors: any) {
    isLoading.value = false;
    error.value = errors;
  }

  async function addApplications(applicationData: any): Promise<any> {
    try {
      ApplicationsStart();
      const response = await applicationsApi.addApplications(applicationData);
      ApplicationsSuccess();
      return response.data;
    } catch (errors: any) {
      getApplicationsFailure(errors);
      throw errors;
    }
  }

  async function updateApplications(id: any, selectedItem: any): Promise<any> {
    try {
      ApplicationsStart();
      await applicationsApi.updateApplications(id, selectedItem);
      ApplicationsSuccess();
    } catch (errors: any) {
      ApplicationsFailure(errors);
      throw errors;
    }
  }

  async function deleteApplications(id: any): Promise<any> {
    try {
      ApplicationsStart();
      await applicationsApi.deleteApplications(id);
      ApplicationsSuccess();
    } catch (errors: any) {
      ApplicationsFailure(errors);
      throw errors;
    }
  }

  return {
    data,
    getApplications,
    isLoading,
    error,
    getApplicationsStart,
    getApplicationsSuccess,
    getApplicationsFailure,
    addApplications,
    ApplicationsStart,
    ApplicationsSuccess,
    ApplicationsFailure,
    updateApplications,
    deleteApplications,
  };
}
