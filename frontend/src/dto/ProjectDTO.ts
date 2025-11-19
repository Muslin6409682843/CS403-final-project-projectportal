export interface ProjectDTO {
  projectID: number;

  projectNameTH: string;
  projectNameEN: string;

  abstractTh: string;
  abstractEn: string;

  keywordsTH: string;
  keywordsEN: string;

  members: string[];
  advisor: string;
  coAdvisors: string[];

  category: string;
  year: string;

  github: string;

  file?: string;
  slideFile?: string;
  zipFile?: string;
}
