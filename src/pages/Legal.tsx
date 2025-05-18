
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Legal = () => {
  const legalDocuments = [
    {
      title: "Terms of Service",
      description: "The rules and guidelines for using LunaTales",
      path: "/legal/terms"
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      path: "/legal/privacy"
    },
    {
      title: "Cookie Policy",
      description: "Information about the cookies we use",
      path: "/legal/cookies"
    }
  ];

  return (
    <div className="py-8 px-0 md:px-2 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Legal Information</h1>
      <p className="text-center text-muted-foreground mb-8">
        Review our policies and legal documents
      </p>
      
      <div className="grid gap-4">
        {legalDocuments.map((doc) => (
          <Link to={doc.path} key={doc.path}>
            <Card className="p-4 hover:shadow-md transition-shadow flex items-center">
              <FileText className="h-8 w-8 text-primary mr-4" />
              <div>
                <h2 className="font-semibold text-lg">{doc.title}</h2>
                <p className="text-muted-foreground text-sm">{doc.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          If you have any questions about our legal documents, please contact us at legal@lunatales.com
        </p>
        <Button asChild variant="outline">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Legal;
